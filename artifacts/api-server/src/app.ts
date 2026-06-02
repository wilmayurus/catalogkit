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
  const options = {
    hostname: "127.0.0.1",
    port: 8000,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: "127.0.0.1:8000",
    },
  };

  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxy.on("error", (err) => {
    logger.error({ err }, "Flask proxy error");
    res.writeHead(502);
    res.end("Bad Gateway: Flask app unreachable");
  });

  req.pipe(proxy, { end: true });
});

export default app;
