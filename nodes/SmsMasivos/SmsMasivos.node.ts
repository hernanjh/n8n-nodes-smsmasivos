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
        usableAsTool: true,
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
                        action: 'Send bulk SMS',
                    },
                    {
                        name: 'Get Inbound SMS',
                        value: 'getReceivedMessages',
                        description: 'Get received SMS messages',
                        action: 'Get inbound SMS',
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
                    {
                        name: 'Check Bulk Status',
                        value: 'checkBulkStatus',
                        description: 'Check status of bulk SMS transmission',
                        action: 'Check bulk status',
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
                        operation: [
                            'send',
                            'sendBulk',
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
                        operation: [
                            'send',
                            'sendBulk',
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
                        operation: [
                            'send',
                            'sendBulk',
                        ],
                    },
                },
                description: 'Whether to validate data without sending message',
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
                        operation: [
                            'send',
                            'sendBulk',
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
                        operation: [
                            'send',
                        ],
                    },
                },

                description: 'Date and time to send the message (GMT -3). If not set, sends immediately.',
            },
            {
                displayName: 'Source Number',
                name: 'sourceNumber',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: [
                            'sms',
                        ],
                        operation: [
                            'getReceivedMessages',
                        ],
                    },
                },
                description: 'Filter messages by origin number',
            },
            {
                displayName: 'Only Unread',
                name: 'onlyUnread',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: [
                            'sms',
                        ],
                        operation: [
                            'getReceivedMessages',
                        ],
                    },
                },
                description: 'Whether to return only unread messages',
            },
            {
                displayName: 'Mark as Read',
                name: 'markAsRead',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: [
                            'sms',
                        ],
                        operation: [
                            'getReceivedMessages',
                        ],
                    },
                },
                description: 'Whether to mark retrieved messages as read',
            },
             {
                displayName: 'Include Internal ID',
                name: 'includeInternalId',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: [
                            'sms',
                        ],
                        operation: [
                            'getReceivedMessages',
                        ],
                    },
                },
                description: 'Whether to include the internal ID in the response if available',
            },
            {
                displayName: 'Check By',
                name: 'checkBy',
                type: 'options',
                options: [
                    {
                        name: 'Internal ID',
                        value: 'idInterno',
                    },
                    {
                        name: 'Date',
                        value: 'date',
                    },
                ],
                default: 'idInterno',
                displayOptions: {
                    show: {
                        resource: [
                            'utility',
                        ],
                        operation: [
                            'checkBulkStatus',
                        ],
                    },
                },
                description: 'Choose how to identify the bulk batch',
            },
            {
                displayName: 'Internal ID',
                name: 'checkId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: [
                            'utility',
                        ],
                        operation: [
                            'checkBulkStatus',
                        ],
                        checkBy: [
                            'idInterno',
                        ],
                    },
                },
                description: 'Internal alphanumeric ID of the batch',
            },
            {
                displayName: 'Date',
                name: 'bulkDate',
                type: 'dateTime',
                default: '',
                displayOptions: {
                    show: {
                        resource: [
                            'utility',
                        ],
                        operation: [
                            'checkBulkStatus',
                        ],
                        checkBy: [
                            'date',
                        ],
                    },
                },
                description: 'Date of the batch processing',
            },
            {
                displayName: 'Only Unread',
                name: 'onlyUnread',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: [
                            'utility',
                        ],
                        operation: [
                            'checkBulkStatus',
                        ],
                    },
                },
                description: 'Whether to return only unread status updates',
            },
            {
                displayName: 'Mark as Read',
                name: 'markAsRead',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: [
                            'utility',
                        ],
                        operation: [
                            'checkBulkStatus',
                        ],
                    },
                },
                description: 'Whether to mark retrieved statuses as read',
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
                    const texto = this.getNodeParameter('texto', j) as string;
                    const idinterno = this.getNodeParameter('idinterno', j) as string;

                    // Sanitize to verify no tabs or newlines break the format
                    // Docs say: "El texto puede contener comas" if separator is tab.
                    // Split numbers, text, and ids by comma, semicolon, or newline
                    // Helper to split and cleanup
                    const splitParam = (param: string) => param.split(/(?<!\\)[,\r\n;]+/).map(s => s.trim().replace(/\\,/g, ',')).filter(s => s !== ''); 
                    
                    // We need to handle sanitized text carefully. The sanitize in previous step removed newlines entirely.
                    // Here we want to split by newlines/commas first, THEN sanitize the content of each message.

                    const tosList = splitParam(tos);
                    const textoList = splitParam(texto);
                    const idList = splitParam(idinterno);

                    // Determine max length to iterate. Usually driven by tosList, but possibly others.
                    // Standard logic: 
                    // 1. If tos has N items, we expect N items in others OR 1 item (broadcast).
                    // 2. We will iterate based on tosList.length.

                    if (tosList.length > 0) {
                        for (let k = 0; k < tosList.length; k++) {
                            const num = tosList[k];
                            
                            // Get corresponding text or fallback to the first/only one
                            const rawText = (k < textoList.length) ? textoList[k] : (textoList.length > 0 ? textoList[0] : '');
                            // Sanitize text for the API (remove tabs/newlines within the message)
                            const cleanText = rawText.replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/\r/g, '');

                            // Get corresponding ID or fallback
                            let rawId = (k < idList.length) ? idList[k] : (idList.length > 0 ? idList[0] : '');
                            // Default ID to number if empty
                            if (!rawId) {
                                rawId = num;
                            }
                            const cleanId = rawId.replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/\r/g, '');

                            bloque += `${cleanId}\t${num}\t${cleanText}\n`;
                        }
                    }
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

                const options = {
                    method: 'POST' as const,
                    url: 'https://servicio.smsmasivos.com.ar/enviar_sms_bloque.asp',
                    form: formData,
                    json: false,
                    responseFormat: 'buffer', // Return buffer to handle encoding manually
                };

                const responseBuffer = await this.helpers.httpRequest(options) as Buffer;

                // Decode ISO-8859-1 (Latin-1) to UTF-8
                let responseString = '';
                if (Buffer.isBuffer(responseBuffer)) {
                    const decoder = new TextDecoder('latin1');
                    responseString = decoder.decode(responseBuffer).trim();
                } else {
                    responseString = (responseBuffer as unknown as string).trim();
                }

                const isSuccess = /OK/i.test(responseString);

                const finalData = {
                    status: isSuccess,
                    message: responseString,
                    timestamp: new Date().toISOString(),
                };

                // For sendBulk, we might return a single item with the result
                return [[{
                    json: finalData,
                    pairedItem: {
                        item: 0,
                    },
                }]];

            } catch (error) {
                if (this.continueOnFail()) {
                    return [[{ json: { error: error.message } }]];
                } else {
                    throw error;
                }
            }
        }



        if (resource === 'sms' && operation === 'getReceivedMessages') {
            try {
                const sourceNumber = this.getNodeParameter('sourceNumber', 0) as string;
                const onlyUnread = this.getNodeParameter('onlyUnread', 0) as boolean;
                const markAsRead = this.getNodeParameter('markAsRead', 0) as boolean;
                const includeInternalId = this.getNodeParameter('includeInternalId', 0) as boolean;
                const credentials = await this.getCredentials('smsMasivosApi');

                const qs: IDataObject = {
                    apikey: credentials.apiKey,
                };

                if (sourceNumber) {
                    qs.origen = sourceNumber;
                }

                if (onlyUnread) qs.solonoleidos = 1;
                if (markAsRead) qs.marcarcomoleidos = 1;
                if (includeInternalId) qs.traeridinterno = 1;

                const options = {
                    method: 'GET' as const,
                    url: 'https://servicio.smsmasivos.com.ar/obtener_sms_entrada.asp',
                    qs,
                    json: false,
                    responseFormat: 'buffer',
                };

                const responseBuffer = await this.helpers.httpRequest(options) as Buffer;
                
                let responseString = '';
                if (Buffer.isBuffer(responseBuffer)) {
                    const decoder = new TextDecoder('latin1');
                    responseString = decoder.decode(responseBuffer).trim();
                } else {
                    responseString = (responseBuffer as unknown as string).trim();
                }

                const lines = responseString.split(/\r?\n/).filter(line => line.trim());
                const returnItems: INodeExecutionData[] = [];

                for (const line of lines) {
                    const parts = line.split('\t');
                    // Format: NUMERO {tab} TEXTO {tab} FECHA {tab} ID SMS MASIVOS {enter}
                    // Or with ID: ... {tab} ID SMS MASIVOS {tab} ID INTERNO {enter}
                    
                    if (parts.length >= 4) {
                         const item: IDataObject = {
                             numero: parts[0],
                             texto: parts[1],
                             fecha: parts[2],
                             idSmsMasivos: parts[3],
                         };

                         if (parts.length >= 5 && includeInternalId) {
                             item.idInterno = parts[4];
                         }

                         returnItems.push({ json: item });
                    }
                }

                return [returnItems];

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
                        uri = 'https://servicio.smsmasivos.com.ar/obtener_saldo.asp';
                        resultMethod = 'balance';
                    } else if (operation === 'getSentCount') {
                        uri = 'https://servicio.smsmasivos.com.ar/obtener_envios.asp';
                        resultMethod = 'sentCount';
                    }

                    const options = {
                        method: 'GET' as const,
                        url: uri,
                        qs: {
                            apikey: credentials.apiKey,
                        },
                        json: false,
                    };

                    const response = await this.helpers.httpRequest(options) as string;
                    // Response is an integer in string format, e.g. "100"

                    return [[{
                        json: {
                            [resultMethod]: parseInt(response, 10),
                        }
                    }]];
                } else if (operation === 'getServerDate') {
                     const options = {
                        method: 'GET' as const,
                        url: 'https://servicio.smsmasivos.com.ar/get_fecha.asp',
                        qs: {
                            iso: 1,
                        },
                        json: false,
                    };

                    const response = await this.helpers.httpRequest(options) as string;
                     // Response is YYYY-MM-DD HH:mm:SS

                    return [[{
                        json: {
                            serverDate: response,
                        }
                    }]];
                } else if (operation === 'checkBulkStatus') {
                    const checkBy = this.getNodeParameter('checkBy', 0) as string;
                    const onlyUnread = this.getNodeParameter('onlyUnread', 0) as boolean;
                    const markAsRead = this.getNodeParameter('markAsRead', 0) as boolean;

                    const qs: IDataObject = {
                        apikey: credentials.apiKey,
                    };

                    if (checkBy === 'idInterno') {
                        qs.idinterno = this.getNodeParameter('checkId', 0) as string;
                    } else if (checkBy === 'date') {
                         const bulkDate = this.getNodeParameter('bulkDate', 0) as string;
                         if (bulkDate) {
                             const dateObj = new Date(bulkDate);
                             // Format: YYYYMMDDHHNNSS (NN = minutes)
                             const pad = (n: number) => n.toString().padStart(2, '0');
                             const formattedDate = dateObj.getFullYear().toString() +
                                                 pad(dateObj.getMonth() + 1) +
                                                 pad(dateObj.getDate()) +
                                                 pad(dateObj.getHours()) +
                                                 pad(dateObj.getMinutes()) +
                                                 pad(dateObj.getSeconds());
                             qs.fecha = formattedDate;
                         }
                    }

                    if (onlyUnread) qs.solonoleidos = 1;
                    if (markAsRead) qs.marcarcomoleidos = 1;

                    const options = {
                        method: 'GET' as const,
                        url: 'https://servicio.smsmasivos.com.ar/obtener_respuestaapi_bloque.asp',
                        qs,
                        json: false, 
                        responseFormat: 'buffer',
                    };

                    const responseBuffer = await this.helpers.httpRequest(options) as Buffer;
                    
                    let responseString = '';
                    if (Buffer.isBuffer(responseBuffer)) {
                        const decoder = new TextDecoder('latin1');
                        responseString = decoder.decode(responseBuffer).trim();
                    } else {
                        responseString = (responseBuffer as unknown as string).trim();
                    }

                    // Parse response
                    // Format: IdInterno {tab} Fecha {tab} Respuesta {enter}
                    // Or "PENDIENTE"
                    // Or Error message

                     if (responseString === 'PENDIENTE') {
                         return [[{ json: { status: 'PENDIENTE' } }]];
                     }
                    
                    const lines = responseString.split(/\r?\n/).filter(line => line.trim());
                    const returnItems: INodeExecutionData[] = [];

                    for (const line of lines) {
                        const parts = line.split('\t');
                        if (parts.length >= 3) {
                             returnItems.push({
                                 json: {
                                     idInterno: parts[0],
                                     fecha: parts[1],
                                     respuesta: parts[2],
                                     originalLine: line
                                 }
                             });
                        } else {
                            // Could be an error message or unexpected format
                             returnItems.push({
                                 json: {
                                     message: line
                                 }
                             });
                        }
                    }

                    return [returnItems];
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

                    const options = {
                        method: 'GET' as const,
                        url: 'https://servicio.smsmasivos.com.ar/enviar_sms.asp',
                        qs,
                        json: false,    // We will parse manually after decoding
                        responseFormat: 'buffer', // Return buffer to handle encoding manually
                    };

                    const responseBuffer = await this.helpers.httpRequest(options) as Buffer;

                    let responseString = '';

                    if (Buffer.isBuffer(responseBuffer)) {
                        const decoder = new TextDecoder('latin1');
                        responseString = decoder.decode(responseBuffer).trim();
                    } else {
                        responseString = (responseBuffer as unknown as string).trim();
                    }

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


                    returnData.push({
                        json: finalData,
                        pairedItem: {
                            item: i,
                        },
                    });
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
