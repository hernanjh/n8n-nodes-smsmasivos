import {
    IExecuteFunctions,
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class SmsMasivos implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'SMS Masivos',
        name: 'smsMasivos',
        icon: 'file:smsmasivos.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Send SMS via SMS Masivos',
        defaults: {
            name: 'SMS Masivos',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'smsMasivosApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'SMS',
                        value: 'sms',
                    },
                    {
                        name: 'Utility',
                        value: 'utility',
                    },
                ],
                default: 'sms',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'sms',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Send',
                        value: 'send',
                        description: 'Send SMS',
                        action: 'Send SMS',
                    },
                    {
                        name: 'Send Bulk',
                        value: 'sendBulk',
                        description: 'Send multiple SMS in a single request',
                        action: 'Send Bulk SMS',
                    },
                ],
                default: 'send',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'utility',
                        ],
                    },
                },
                options: [
                    {
                        name: 'Get Balance',
                        value: 'getBalance',
                        description: 'Get account balance',
                        action: 'Get account balance',
                    },
                    {
                        name: 'Get Sent Count',
                        value: 'getSentCount',
                        description: 'Get number of sent messages',
                        action: 'Get sent count',
                    },
                    {
                        name: 'Get Server Date',
                        value: 'getServerDate',
                        description: 'Get current server date',
                        action: 'Get server date',
                    },
                ],
                default: 'getBalance',
            },
            {
                displayName: 'Mobile Number',
                name: 'tos',
                type: 'string',
                default: '',
                placeholder: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: [
                            'sms',
                        ],
                    },
                },
                description: 'Phone number to send the message to',
            },
            {
                displayName: 'Message',
                name: 'texto',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: [
                            'sms',
                        ],
                    },
                },
                description: 'Message to send (max 160 characters)',
            },
            {
                displayName: 'Test Mode',
                name: 'test',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: [
                            'sms',
                        ],
                    },
                },
                description: 'If set, data is validated but message is not sent',
            },
            {
                displayName: 'Internal ID',
                name: 'idinterno',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: [
                            'sms',
                        ],
                    },
                },
                description: 'Internal alphanumeric ID (max 50 chars)',
            },
            {
                displayName: 'Schedule Date',
                name: 'fechadesde',
                type: 'dateTime',
                default: '',
                displayOptions: {
                    show: {
                        resource: [
                            'sms',
                        ],
                    },
                },
                description: 'Date and time to send the message (GMT -3). If not set, sends immediately.',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;


        if (resource === 'sms' && operation === 'sendBulk') {
            try {
                // Collect all items to build the block
                let bloque = '';
                const test = this.getNodeParameter('test', 0) as boolean;
                const credentials = await this.getCredentials('smsMasivosApi');

                // Iterate over all items to build the block
                for (let j = 0; j < items.length; j++) {
                    const tos = this.getNodeParameter('tos', j) as string;
                    let texto = this.getNodeParameter('texto', j) as string;
                    let idinterno = this.getNodeParameter('idinterno', j) as string;

                    // Default idinterno to tos if empty, as per docs suggestion or logic
                    if (!idinterno) {
                        idinterno = tos;
                    }

                    // Sanitize to verify no tabs or newlines break the format
                    // Docs say: "El texto puede contener comas" if separator is tab.
                    // We must ensure text doesn't contain tabs or newlines.
                    texto = texto.replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/\r/g, '');
                    idinterno = idinterno.replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/\r/g, '');

                    bloque += `${idinterno}\t${tos}\t${texto}\n`;
                }

                const formData: IDataObject = {
                    api: 1,
                    apikey: credentials.apiKey,
                    bloque,
                    separadorcampos: 'tab',
                };

                if (test) {
                    formData.test = 1;
                }

                const options: IDataObject = {
                    method: 'POST',
                    uri: 'http://servicio.smsmasivos.com.ar/enviar_sms_bloque.asp',
                    form: formData,
                    encoding: null, // Return buffer to handle encoding manually
                    json: false,
                };

                const responseBuffer = await this.helpers.request(options) as Buffer;

                // Decode ISO-8859-1 (Latin-1) to UTF-8
                const decoder = new TextDecoder('latin1');
                const responseString = decoder.decode(responseBuffer).trim();

                const isSuccess = /OK/i.test(responseString);

                const finalData = {
                    status: isSuccess,
                    message: responseString,
                    timestamp: new Date().toISOString(),
                };

                // For sendBulk, we might return a single item with the result
                return [[{ json: finalData }]];

            } catch (error) {
                if (this.continueOnFail()) {
                    return [[{ json: { error: error.message } }]];
                } else {
                    throw error;
                }
            }
        }

        if (resource === 'utility') {
            const credentials = await this.getCredentials('smsMasivosApi');
            try {
                if (operation === 'getBalance' || operation === 'getSentCount') {
                    let uri = '';
                    let resultMethod = '';

                    if (operation === 'getBalance') {
                        uri = 'http://servicio.smsmasivos.com.ar/obtener_saldo.asp';
                        resultMethod = 'balance';
                    } else if (operation === 'getSentCount') {
                        uri = 'http://servicio.smsmasivos.com.ar/obtener_envios.asp';
                        resultMethod = 'sentCount';
                    }

                    const options: IDataObject = {
                        method: 'GET',
                        uri,
                        qs: {
                            apikey: credentials.apiKey,
                        },
                        json: false,
                    };

                    const response = await this.helpers.request(options) as string;
                    // Response is an integer in string format, e.g. "100"

                    return [[{
                        json: {
                            [resultMethod]: parseInt(response, 10),
                        }
                    }]];
                } else if (operation === 'getServerDate') {
                     const options: IDataObject = {
                        method: 'GET',
                        uri: 'http://servicio.smsmasivos.com.ar/get_fecha.asp',
                        qs: {
                            iso: 1,
                        },
                        json: false,
                    };

                    const response = await this.helpers.request(options) as string;
                     // Response is YYYY-MM-DD HH:mm:SS

                    return [[{
                        json: {
                            serverDate: response,
                        }
                    }]];
                }
            } catch (error) {
                 if (this.continueOnFail()) {
                    return [[{ json: { error: error.message } }]];
                } else {
                    throw error;
                }
            }
        }

        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'sms' && operation === 'send') {
                    const tos = this.getNodeParameter('tos', i) as string;
                    const texto = this.getNodeParameter('texto', i) as string;
                    const test = this.getNodeParameter('test', i) as boolean;
                    const idinterno = this.getNodeParameter('idinterno', i) as string;
                    const fechadesde = this.getNodeParameter('fechadesde', i) as string;

                    const credentials = await this.getCredentials('smsMasivosApi');

                    const qs: IDataObject = {
                        api: 1,
                        apikey: credentials.apiKey,
                        tos,
                        texto,
                    };

                    if (test) {
                        qs.test = 1;
                    }

                    if (idinterno) {
                        qs.idinterno = idinterno;
                    }

                    if (fechadesde) {
                        const dateObj = new Date(fechadesde);
                        // Convert to ISO string and take the first 19 chars: "YYYY-MM-DDTHH:mm:ss"
                        // Then replace T with space.
                        // Ideally we should handle timezone properly, but assuming input is already correct or handled by user.
                        qs.fechadesde = dateObj.toISOString().replace('T', ' ').substring(0, 19);
                    }

                    const options: IDataObject = {
                        method: 'GET',
                        uri: 'http://servicio.smsmasivos.com.ar/enviar_sms.asp',
                        qs,
                        encoding: null, // Return buffer to handle encoding manually
                        json: false,    // We will parse manually after decoding
                    };

                    const responseBuffer = await this.helpers.request(options) as Buffer;

                    // Decode ISO-8859-1 (Latin-1) to UTF-8
                    const decoder = new TextDecoder('latin1');
                    const responseString = decoder.decode(responseBuffer).trim();

                    let finalData: IDataObject = {};

                    // Check if response seems to be the standard "OK" or "1"
                    // The API might return "OK" or "1" for success, sometimes followed by newlines which we trimmed.
                    const isSuccess = /OK/i.test(responseString) || responseString === '1' || responseString === 'true';

                    if (isSuccess) {
                        finalData = {
                            status: true,
                            message: responseString,
                            timestamp: new Date().toISOString()
                        };
                    } else {
                        // If it's not a simple OK/1, it might be an error message or other data.
                        // We treat it as an error/message.
                        finalData = {
                            status: false,
                            message: responseString,
                            timestamp: new Date().toISOString()
                        };
                    }


                    returnData.push({ json: finalData });
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                } else {
                    throw error;
                }
            }
        }

        return [returnData];
    }
}
