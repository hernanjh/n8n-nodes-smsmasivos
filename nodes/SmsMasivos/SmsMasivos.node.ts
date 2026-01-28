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
                type: 'hidden',
                options: [
                    {
                        name: 'SMS',
                        value: 'sms',
                    },
                ],
                default: 'sms',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'hidden',
                options: [
                    {
                        name: 'Send',
                        value: 'send',
                        description: 'Send SMS',
                        action: 'Send SMS',
                    },
                ],
                default: 'send',
            },
            {
                displayName: 'Mobile Number',
                name: 'tos',
                type: 'string',
                default: '',
                placeholder: '',
                required: true,
                description: 'Phone number to send the message to',
            },
            {
                displayName: 'Message',
                name: 'texto',
                type: 'string',
                default: '',
                required: true,
                description: 'Message to send (max 160 characters)',
            },
            {
                displayName: 'Test Mode',
                name: 'test',
                type: 'boolean',
                default: false,
                description: 'If set, data is validated but message is not sent',
            },
            {
                displayName: 'Internal ID',
                name: 'idinterno',
                type: 'string',
                default: '',
                description: 'Internal alphanumeric ID (max 50 chars)',
            },
            {
                displayName: 'Schedule Date',
                name: 'fechadesde',
                type: 'dateTime',
                default: '',
                description: 'Date and time to send the message (GMT -3). If not set, sends immediately.',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

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
