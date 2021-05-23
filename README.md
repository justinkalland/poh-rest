# Proof of Humanity REST

A read-only RESTful API for the Proof of Humanity protocol. Pulls data from the blockchain, IPFS, and other sources to build a local relational database. Serves the data via a simple REST API.

This project compiles information about Proof of Humanity, stores and serves it in a centralized mutable manner. It would be bad practice to rely on this as a source of truth or as a critical service.

Sometimes centralized relational data is preferable. Such as building aggregated reports, data visualization, widgets, or for fun informative services.

The goal of this API is to be intuitive and easy. To achieve this the schema is more understandable than the low-level data. For example the `/profile` endpoint.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
