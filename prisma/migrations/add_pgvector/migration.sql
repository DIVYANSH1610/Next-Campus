CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "College"
ADD COLUMN "embedding" vector(768);

CREATE INDEX college_embedding_idx
ON "College"
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 10);