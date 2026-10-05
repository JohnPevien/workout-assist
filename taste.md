# Developer Taste

These are strong defaults, not overrides of current instructions, product requirements, correctness, accessibility, security, or existing architecture.

## Structure and scope

- Keep components flat while the structure remains lean and easy to scan. Group by feature when it grows crowded; extract shared modules only for genuine reuse.
- Move logic into a hook or utility when it is reused or makes its component hard to follow, not simply to make a component shorter.
- Make the smallest change that solves the request. Leave unrelated cleanup alone.

## Types and validation

- Type domain data and component props explicitly; let straightforward local values be inferred.
- Validate user input and persisted data at their owning boundaries. Prefer small handwritten checks for this app; consider a schema dependency when complexity justifies it.

## Tests and comments

- Colocate component tests beside their components. Cover meaningful behavior and risky state transitions, not prop forwarding, incidental markup, or lines for their own sake.
- Keep comments only when they explain a non-obvious *why* that the code cannot show.
