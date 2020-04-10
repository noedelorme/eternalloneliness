'use strict';

const driveUploadPath = 'https://www.googleapis.com/upload/drive/v3/files';

// 'id' is driveId - unique file id on google drive
// 'version' is driveVersion - version of file on google drive
// 'name' name of the file on google drive
// 'appProperties' keep the custom `ifid` field
const fileFields = 'id,version,name,appProperties';

function formatFileDescription(response) {
	response = response || null;
	if (response && !response.error) {
		return {
			driveId: response.id,
			driveVersion: response.version,
			name: response.name,
			ifid: response.appProperties.ifid
		};
	}
	else {
		return {
			driveId: '',
			driveVersion: -1,
			name: '',
			ifid: ''
		};
	}
}

let clientLoaded = false;

module.exports = {
	/**
	 * Loads the client. When ready isLoaded() will return true.
	 * Never rejects
	 *
	 * @method init
	 * @return {Promise}
	 */
	isLoaded() {
		return clientLoaded;
	},

	/**
	 * Loads the client. When ready isLoaded() will return true.
	 * Never rejects
	 *
	 * @method init
	 * @return {Promise}
	 */
	init() {
		return new Promise(resolve => {
			gapi.load('client', () =>
				gapi.client.load('drive', 'v3', () => {
					clientLoaded = true;
					resolve();
				})
			);
		})
	},

	/**
	 * Get all stories available on the Google Drive. Never rejects
	 *
	 * @method listFiles
	 * @return {Promise|Array} A promise of the result that
	 * returns an array of file descriptions:
	 * [{driveId, driveVersion, name, ifid}]
	 */
	listFiles() {
		function formatResult(response){
			var stories = [];
			for(var i = 0; i < response.files.length; i++) {
				const file = response.files[i];
				stories.push(formatFileDescription(file));
			}
			return stories;
		};

		return new Promise( (resolve, reject) => {
			gapi.client.drive.files.list({
				'pageSize': 300,
				'fields': 'files(' + fileFields + ')',
				'q': 'trashed=false'
			}).execute(
				(response) => resolve(formatResult(response))
			);
		});
	},

	/**
	 * Creates file with name and uploads data. Never rejects
	 *
	 * @method createFile
	 * @param {String} name Name of the new file on Google Drive
	 * @param {String} ifid Interactive Fiction Identifier. Internal id
	 * @param {String} data Data to put into the file
	 * @return {Promise|Object} A promise of the result that returns
	 * a file description: {driveId, driveVersion, name, ifid}
	 */
	createFile(name, ifid, data) {
		// Current version of gapi.client.drive is not capable of
		// uploading the file so we'll do it with more generic
		// interface. This will create file with given name and
		// properties in one request with multipart request.

		// Some random string that is unlikely to be in transmitted data:
		const boundary = '-batch-31415926579323846boundatydnfj111';
		const delimiter = "\r\n--" + boundary + "\r\n";
		const close_delim = "\r\n--" + boundary + "--";

		const metadata = {
			'mimeType': 'Content-Type: text/xml',
			'name': name,
			'appProperties': {ifid: ifid}
		}

		const multipartRequestBody =
			delimiter +
			'Content-Type: application/json\r\n\r\n' +
			JSON.stringify(metadata) +
			delimiter +
			'Content-Type: text/xml\r\n\r\n' +
			data +
			close_delim;

		return new Promise( (resolve, reject) => {
			gapi.client.request({
				'path': driveUploadPath,
				'method': 'POST',
				'params': {
					'uploadType': 'multipart',
					'fields': fileFields
				},
				'headers': {
					'Content-Type': 'multipart/related; boundary="' + boundary + '"'
				},
				'body': multipartRequestBody,
			}).then(
				(response) => resolve(formatFileDescription(response.result)),
				(error) => resolve(formatFileDescription())
			);
		});
	},

	/**
	 * Get the file description. Never rejects
	 *
	 * @method getFileDescription
	 * @param {String} driveId Google Drive file identifier
	 * @return {Promise|Object} A promise of the result that returns
	 * a file description: {driveId, driveVersion, name, ifid}
	 */
	getFileDescription(driveId) {
		return new Promise( (resolve, reject) => {
			gapi.client.drive.files.get({
				'fileId': driveId,
				'fields': fileFields,
			}).execute(
				(response) => resolve(formatFileDescription(response))
			);
		});
	},

	/**
	 * Downloads the content of the file. Can reject
	 *
	 * @method downloadFile
	 * @param {String} driveId Google Drive file identifier
	 * @return {Promise|String} A promise of the result that returns
	 * a file data string
	 */
	downloadFile(driveId) {
		return new Promise( (resolve, reject) => {
			gapi.client.drive.files.get({
				'fileId': driveId,
				'alt': 'media'
			}).then(
				(data) => resolve(data.body),
				reject
			);
		});
	},

	/**
	 * Changes the name of the file on Google Drive. Can reject
	 *
	 * @method renameFile
	 * @param {String} driveId Google Drive file identifier
	 * @param {String} newName New name that will be displayed in drive
	 * @return {Promise|Object} A promise of the result that returns
	 * a file description: {driveId, driveVersion, name, ifid}
	 */
	renameFile(driveId, newName) {
		return new Promise( (resolve, reject) => {
			gapi.client.drive.files.update({
				'fileId': driveId,
				'name': newName,
				'fields': fileFields
			}).then(
				(response) => resolve(formatFileDescription(response.result)),
				reject
			);
		});
	},

	/**
	 * Removes file completely from drive. Can reject
	 *
	 * @method deleteFile
	 * @param {String} driveId Google Drive file identifier
	 * @return {Promise} A promise of the result
	 */
	deleteFile(driveId) {
		return new Promise( (resolve, reject) => {
			gapi.client.drive.files.delete({
				'fileId': driveId
			}).then(resolve, reject);
		});
	},

	/**
	 * Replaces the file content with newData. Can reject
	 *
	 * @method updateFile
	 * @param {String} driveId Google Drive file identifier
	 * @param {String} newData Data to put into the file
	 * @return {Promise|Object} A promise of the result that returns
	 * a story description: {driveId, driveVersion, name, ifid}
	 */
	updateFile(driveId, newData) {
		return new Promise( (resolve, reject) => {
			gapi.client.request({
				'path': driveUploadPath+'/'+driveId,
				'method': 'PATCH',
				'params': {'uploadType': 'media', 'fields': fileFields},
				'body': newData
			}).then(
				(response) => resolve(formatFileDescription(response.result)),
				reject
			);
		});
	}

};