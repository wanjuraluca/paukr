-- Per explicit user instruction: batch 3's 20 questions go live immediately
-- instead of waiting for manual /review approval. Still fully removable
-- afterwards via /review's "Freigabe zurückziehen" action, same as any
-- other question.

update questions set reviewed = true where reviewed = false;
