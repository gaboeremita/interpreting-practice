import { Router } from "express";
import type { ContentCatalog } from "./contentCatalog.js";

export function createContentRouter(catalog: ContentCatalog): Router {
  const router = Router();

  router.get("/", (_request, response) => {
    response.set("Cache-Control", "public, max-age=300").json(catalog.getContent());
  });

  return router;
}
