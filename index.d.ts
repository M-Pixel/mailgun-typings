import {Stream} from "stream"

declare namespace MailgunJs {
	export interface IOptions {
		/**
		 * Your Mailgun API KEY
		 */
    	apiKey:string;
		 
		/**
		 * Your Mailgun Domain
		 */
    	domain:string;
		 
		/**
		 * Set to true if you wish to mute the console error logs in validateWebhook() function
		 */
   	mute?:boolean;
		
		/**
		 * The proxy URI in format http[s]://[auth@]host:port. ex: 'http://proxy.example.com:8080'
		 */
		proxy?:string;
	
		/**
		 * Request timeout in milliseconds
		 */
   	timeout?:number;
		
		/**
		 * The mailgun host (default: 'api.mailgun.net')
		 */
    	host?:string;
		 
		/**
		 * The mailgun protocol (default: 'https:', possible values: 'http:' or 'https:')
		 */
		protocol?:"https:"|"http:";
		
		/**
		 * The mailgun port (default: '443')
		 */
   	port?:number;
		
		/**
		 * the mailgun host (default: '/v3')
		 */
   	endpoint?:string;
		
		/**
		 * the number of total attempts to do when performing requests. Default is 1. That is, we will try an operation only once with no retries on error.
		 */
   	retry?:number;
	}

	export type ValidAttachment = string|Buffer|Stream|Attachment;

	interface IMessageData {
		/**
		 * Email address for From header
		 */
		from:string;
		
		/**
		 * Email address of the recipient(s). Example: "Bob <bob@host.com>". You can use commas to separate multiple recipients.
		 */
		to:string;
		
		/**
		 * Same as To but for Cc.
		 */
		cc?:string;

		/**
		 * Same as To but for Bcc.
		 */
		bcc?:string;
		
		/**
		 * Message subject
		 */
		subject:string;
		
		/**
		 * Body of the message. (text version)
		 */
		text?:string;
		
		/**
		 * Body of the message. (HTML version)
		 */
		html?:string;
		
		/**
		 * Attachments can be sent using either the attachment or inline parameters.
		 * String for file path, Buffer or Stream for file contents.
		 * If a buffer is used the data will be attached using a generic filename "file".
		 */
		attachment?:ValidAttachment|ValidAttachment[];
		
		/**
		 * Can be use to send an attachment with inline disposition. It can be used to send inline images.
		 * String for file path, Buffer or Stream for file contents.
		 * If a buffer is used the data will be attached using a generic filename "file".
		 */
		inline?:ValidAttachment|ValidAttachment[];
	
		/**
		 * Replaces <code>%recipient.key%</code> in the message and subject
		 */
		"recipient-variables"?:{[email:string]:{[key:string]:string|number}};
		
		/**
		 * Tag string
		 */
		"o:tag"?:string;
		
		/**
		 * Id of the campaign the message belongs to. See um-campaign-analytics for details.
		 */
		"o:campaign"?:string;
		
		/**
		 * Enables/disables DKIM signatures on per-message basis.
		 */
		"o:dkim"?:"yes"|"no";

		/**
		 * Desired time of delivery.
		 * Note: Messages can be scheduled for a maximum of 3 days in the future.
		 */
		"o:deliverytime"?:number;

		/**
		 * Enables sending in test mode.
		 */
		"o:testmode"?:"yes"|"no";

		/**
		 * Toggles tracking on a per-message basis
		 */
		"o:tracking"?:"yes"|"no";		
		
		/**
		 * Toggles clicks tracking on a per-message basis. Has higher priority than domain-level setting.
		 */
		"o:tracking-clicks"?:"yes"|"no"|"htmlonly";
	
		/**
		 * Toggles opens tracking on a per-message basis. Has higher priority than domain-level setting.
		 */
		"o:tracking-opens"?:"yes"|"no";
	
		/**
		 * If set to True this requires the message only be sent over a TLS connection. If a TLS connection can not be established, Mailgun will not deliver the message.
		 *
		 * If set to False, Mailgun will still try and upgrade the connection, but if Mailgun can not, the message will be delivered over a plaintext SMTP connection.
		 *
		 * The default is False.
		 */
		"o:require-tls"?:boolean;
		
		/**
		 * If set to True, the certificate and hostname will not be verified when trying to establish a TLS connection and Mailgun will accept any certificate during delivery.
		 *
		 * If set to False, Mailgun will verify the certificate and hostname. If either one can not be verified, a TLS connection will not be established.
		 *
		 * The default is False.
		 */
		"o:skip-verification"?:boolean;
	}

	interface IMimeMessageData {
		to:string;
		
		/**
		 * Can be a full file path to the MIME file, a stream of the file (that is a Readable object), or a string representation of the MIME message.
		 */
		message:string|Stream;
	}

	type Callback = (error:string, body:string)=>void;

	/**
	 * This API allows you to send, access, and delete mesages programmatically.
	 */
	interface MessagesApi {
		/**
		 * Sends a message by assembling it from the components.
		 */
		send(data:IMessageData, callback?:Callback):Promise<any>;
		sendMime(data:IMimeMessageData, callback?:Callback):Promise<any>;
	}

	interface MessageApi {
		/**
		 * Returns a single message in JSON format. To get full MIME message set MIME to true.
		 */
		info(data:{MIME:boolean}, callback?:Callback):Promise<any>;
		info(callback?:Callback):Promise<any>;
	
		/**
		 * To delete an inbound message that has been stored via the store() action.
		 */
		delete(callback?:Callback):Promise<any>;
	}

	interface DomainsApi {
		/**
		 * Returns a list of domains under your account in JSON.
		 */
		list(data:{limit?:number, skip?:number}, callback?:Callback):Promise<any>;
		list(callback?:Callback):Promise<any>;
		
		/**
		 * Create a new domain.
		 */
		create(data:{name:string, smtp_password:string, wildcard?:boolean}, callback?:Callback):Promise<any>;
	}

	interface DomainApi {
		/**
		 * Returns a single domain, including credentials and DNS records.
		 */
		info(callback?:Callback):Promise<any>;
	
		/**
		 * Delete a domain from your account.
		 */
		delete(callback?:Callback):Promise<any>;
	
		/**
		 * Programmatically get and modify domain credentials.
		 */
		credentials():CredentialsApi;
		credentials(id:string):CredentialApi;
	}

	interface CredentialsApi {
		/**
		 * Returns a list of SMTP credentials for the defined domain.
		 */
		list(data:{limit?:number, skip?:number}, callback:Callback):Promise<any>;
		list(callback?:Callback):Promise<any>;
	
		/**
		 * Creates a new set of SMTP credentials for the defined domain.
		 */
		create(data:{login:string, password:string}, callback?:Callback):Promise<any>;
	
	}

	interface CredentialApi {
		/**
		 * Updates the specified SMTP credentials. Currently only the password can be changed.
		 */
		update(data:{password:string}, callback?:Callback):Promise<any>;
	
		/**
		 * Deletes the defined SMTP credentials.
		 */
		delete(callback?:Callback):Promise<any>;
	}

	interface ListsApi {
		/**
		 * Returns a list of mailing lists under your account.
		 */
		list(data:{address?:string, limit?:number, skip?:number}, callback?:Callback):Promise<any>;
		list(callback?:Callback):Promise<any>;
		
		/**
		 * Creates a new mailing list.
		 */
		create(data:{address:string, name?:string, description?:string, access_level?:string}, callback?:Callback):Promise<any>;

		/**
		 * Programatically work with mailing lists members.
		 */
		members():MembersApi;
		// TODO: MemberApi
	}

	interface ListApi {
		/**
		 * Returns a single mailing list by a given address.
		 */
		info(callback?:Callback):Promise<any>;
	
		/**
		 * Update mailing list properties, such as address, description or name.
		 */
		update(data:{address?:string, name?:string, description?:string, access_level?:string}, callback?:Callback):Promise<any>;
		update(callback?:Callback):Promise<any>;

		/**
		 * Deletes a mailing list.
		 */
		delete(callback?:Callback):Promise<any>;
	}

	interface IMemberOptions {
		name?:string;
		address:string;
		vars:{[key:string]:number|string};
	}

	interface MembersApi {
		/**
		 * Create a mailing list member.
		 */
		create(options:IMemberOptions, callback?:Callback):Promise<any>;
		
		/**
		 * Adds multiple members, up to 1,000 per call, to a Mailing List.
		 */
		add(options:{members:IMemberOptions[], subscribed:boolean}, callback?:Callback):Promise<any>;
	
		// TODO: Finish
	}

	export class Mailgun {
		/**
		 * Subclass references
		 */
		Attachment:typeof Attachment;

		constructor(options:IOptions);

		/**
		 * This API allows you to send, access, and delete mesages programmatically.
		 */
		messages():MessagesApi;
		messages(id:string):MessageApi;

		/**
		 * This API allows you to create, access, and validate domains programmatically.
		 */
		domains():DomainsApi;
		domains(id:string):DomainApi;

		// TODO: complaints
		// TODO: unsubscribes
		// TODO: bounces
		// TODO: routes

		/**
		 * You can programmatically work with mailing lists and mailing list memebers using Mailgun Mailing List API.
		 */
		lists():ListsApi;
		lists(id:string):ListApi;
		
		// TODO: Campaigns

		// TODO: Stats
		// TODO: Tags
		// TODO: Events

		/**
		 * Sends GET request to the specified resource on api
		 */
		get(resource:string, data:Object|string, callback?:Callback):Promise<any>;
		
		/**
		 * Sends POST request to the specified resource on api
		 */
		post(resource:string, data:Object|string, callback?:Callback):Promise<any>;

		/**
		 * Sends DELETE request to the specified resource on api
		 */
		delete(resource:string, data:Object|string, callback?:Callback):Promise<any>;		
		
		/**
		 * Sends PUT request to the specified resource on api
		 */
		put(resource:string, data:Object|string, callback?:Callback):Promise<any>;
		
		validateWebhook(timestamp:number, token:string, signature:string):boolean;
	}

	export interface IAttachmentOptions {
		/**
		 * can be one of
		 * • A string representing file path to the attachment
		 * • A buffer of file data
		 * • An instance of Readable which means it is a readable stream.
		 */
		data:string|Buffer|Stream;
		
		/**
		 * The file name to be used for the attachment. Default is 'file'.
		 */
		filename?:string;
		
		/**
		 * The content type. Required for case of Readable data. Ex. image/jpg.
		 */
		contentType?:string;
		
		/**
		 * The content length in bytes. Required for case of Readable data.
		 */
		knownLength?:number;
	}

	export class Attachment {
		constructor(options:IAttachmentOptions);
	}
}

declare module "mailgun-js" {
	export = MailgunJs.Mailgun;
}
