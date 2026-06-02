import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import http from "http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Forward all other requests to the Flask app on port 8000
app.use((req: Request, res: Response) => {
  // Express middleware (urlencoded/json) consumes the request stream before
  // we get here, so we must re-serialise the parsed body instead of piping.
  const contentType = (req.headers["content-type"] ?? "").toLowerCase();
  const isUrlEncoded = contentType.includes("application/x-www-form-urlencoded");
  const isJson = contentType.includes("application/json");

  let bodyBuffer: Buffer | null = null;
  if (isUrlEncoded && req.body && typeof req.body === "object") {
    bodyBuffer = Buffer.from(
      new URLSearchParams(req.body as Record<string, string>).toString(),
      "utf8",
    );
  } else if (isJson && req.body !== undefined) {
    bodyBuffer = Buffer.from(JSON.stringify(req.body), "utf8");
  }

  const headers: Record<string, string | string[] | undefined> = {
    ...req.headers,
    host: "127.0.0.1:8000",
  };
  if (bodyBuffer !== null) {
    headers["content-length"] = String(bodyBuffer.byteLength);
  }

  const options = {
    hostname: "127.0.0.1",
    port: 8000,
    path: req.url,
    method: req.method,
    headers,
  };

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxy.on("error", (err) => {
    logger.error({ err }, "Flask proxy error");
    if (!res.headersSent) {
      res.writeHead(502);
      res.end("Bad Gateway: Flask app unreachable");
    }
  });

  if (bodyBuffer !== null) {
    // Body already parsed — write it directly and end
    proxy.write(bodyBuffer);
    proxy.end();
  } else {
    // Multipart file uploads and GET/HEAD — stream is still intact
    req.pipe(proxy, { end: true });
  }
});

export default app;
