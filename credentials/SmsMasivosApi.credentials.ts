import {
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class SmsMasivosApi implements ICredentialType {
	name = 'smsMasivosApi';
	displayName = 'SMS Masivos API';
	documentationUrl = 'https://servicio.smsmasivos.com.ar/ayuda/Gu%C3%ADa%20API%20SMS%20Masivos.pdf';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
	
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://servicio.smsmasivos.com.ar',
			url: '/obtener_saldo.asp',
			qs: {
				apikey: '={{$credentials.apiKey}}',
			},
		},
	};
}
