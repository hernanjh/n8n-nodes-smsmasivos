# n8n-nodes-smsmasivos

This is an n8n community node. It lets you use [SMS Masivos](https://smsmasivos.com.ar) in your n8n workflows.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### SMS Masivos
* **Send SMS**: Send an SMS message to a mobile number.
    * **TOS**: Mobile number (e.g., 1160593072).
    * **TEXTO**: Message content (max 160 characters).
    * **TEST**: Validate data without sending.
    * **IDINTERNO**: Optional internal ID.
    * **FECHADESDE**: Optional schedule date.

## Credentials

You need an API Key from SMS Masivos to use this node.
1. Create a `SMS Masivos API` credential in n8n.
2. Enter your API Key.

## Compatibility

* n8n v0.1.0+

## License

MIT

## Repository

https://github.com/hernanjh/n8n-nodes-smsmasivos
