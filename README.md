<p align="center"><img src="https://user-images.githubusercontent.com/43973143/119685114-5dc2cb00-be45-11eb-9705-1877acf06d62.png" width="200"></p>

# Proof of Humanity REST

A read-only RESTful API for the Proof of Humanity protocol. Pulls data from the blockchain, IPFS, and other sources to build a local relational database. Serves the data via a simple REST API.

The goal of this API is to be fast, intuitive, and easy. To achieve this the schema is more understandable than the low-level data.

## 📖 ➡️ [Documentation](https://api.poh.dev/docs)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## ⚠️ Alpha

This project is in its infancy. There may be significant changes to the endpoints. The data served might be inaccurate.

## Centralization

This project compiles information about Proof of Humanity, stores and serves it in a centralized mutable manner. It would be bad practice to rely on this as a source of truth or as a critical service.

Sometimes centralized relational data is preferable. Such as building aggregated reports, data visualization, widgets, or for fun informative services.
