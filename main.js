var http = require("https");

/**
 * Represents a TaguchiMail connection. Must be created prior to instantiation 
 * of any other TaguchiMail classes, as it's a required parameter for their 
 * constructors.
 *
 * hostname: string
 *     Contains the hostname (or IP address) of the TaguchiMail instance to
 *     connect with.
 * username: string
 *     Contains the username (email address) of an authorized user.
 * password: string
 *     Contains the password of an authorized user.
 * organization_id: string/integer
 *     Indicates the organization ID to be used for creation of new objects. 
 *     The username supplied must be authorized to access this organization.
 */
function Context(hostname, username, password, organization_id) {

    this.hostname = hostname;
    this.username = username;
    this.password = password;
    this.organization_id = organization_id;

    /**
     * Makes a TaguchiMail request.
     *
     * resource: string
     *     Indicates the resource e.g. activity and campaign.
     * command: string
     *     Indicates the command to issue to the resource.
     * options.record_id: string/integer
     *     Indicates the ID of the record to operate on, for record-specific
     *     commands.
     * options.data: string
     *     Contains the JSON-formatted record data for the command, if required
     *     by the command type.
     * options.parameters: associative array
     *     Contains additional parameters to the request. The supported
     *     parameters will depend on the resource and command, but commonly
     *     supported parameters include:
     *     * sort: one of the resource's fields, used to sort the result set;
     *     * order: either 'asc' or 'desc', determines whether the result set 
     *       is sorted in ascending or descending order;
     *     * limit: positive non-zero integer indicating the maximum returned
     *       result set size (default to 1);
     *     * offset: either 0 or a positive integer indicating the position of
     *       the first returned result in the result set (default to 0).
     * options.query: array
     *     Contains query predicates, each of the form: [field]-[operator]-
     *     [value] where [field] is one of the defined resource fields,
     *     [operator] is one of the below-listed comparison operators, and
     *     [value] is a string value to which the field should be compared.
     *     Supported operators:
     *     * eq: mapped to SQL '=', test for equality between [field] and
     *       [value] (case-sensitive for strings);
     *     * neq: mapped to SQL '!=', test for inequality between [field] and
     *       [value] (case-sensitive for strings);
     *     * lt: mapped to SQL '<', test if [field] is less than [value];
     *     * gt: mapped to SQL '>', test if [field] is greater than [value];
     *     * lte: mapped to SQL '<=', test if [field] is less than or equal to
     *       [value];
     *     * gte: mapped to SQL '>=', test if [field] is greater than or equal
     *       to [value];
     *     * re: mapped to PostgreSQL '~', interprets [value] as POSIX regular
     *       expression and test if [field] matches it;
     *     * rei: mapped to PostgreSQL '~*', performs a case-insensitive POSIX
     *       regular expression match;
     *     * like: mapped to SQL 'LIKE' (case-sensitive);
     *     * is: mapped to SQL 'IS', should be used to test for NULL values in
     *       the database as [field]-eq-null is always false;
     *     * nt: mapped to SQL 'IS NOT', should be used to test for NOT NULL
     *       values in the database as [field]-neq-null is always false.
     */
    this.make_request = function(resource, command, options) {
        if (options.record_id == undefined) options.record_id = null;
        if (options.data == undefined) options.data = null;
        if (options.parameters == undefined) options.parameters = null;
        if (options.query == undefined) options.query = null;
        
        // work out the query URL
        var qs = "https://" + this.hostname + "/admin/api/";
        qs += this.organization_id + "/" + resource + "/";
        qs += (options.record_id == null) ? "": options.record_id;
        qs += "?_method=" + command;
        qs += "&auth=" + this.username + "|" + this.password;
        if (options.query != null) {
            for (var i = 0; i < options.query.length; i++) {
                qs += "&query=" + options.query[i];
            }   
        }   
        if (options.parameters != null) {
            for (var key in options.parameters) {
                qs += "&" + key + "=" + options.parameters[key];
            }   
        }
        qs = encodeURI(qs); 

        // send the request to the server
        var headers = {PreAuthenticate: "true", Accept: "application/json", 
            UserAgent: "TMAPIv4 JS Wrapper"};
        if (command == "GET") {
            return http.get(qs, null, {headers: headers});
        } else {
            if (options.data != null && options.data.length > 0) {
                headers["Content-Type"] = "application/json";
                headers["Content-Length"] = options.data.length;
            }
            return http.post(qs, null, {headers: headers, body: options.data});
        }
    }
}

/**
 * Base class for TM record types.
 *
 * context: Context
 *     Determines the TM instance and organization to which the record belongs.
 * options.resource_type: string
 *     The type of resource this record represents e.g. activity and campaign.
 * options.backing: associative array
 *     The data backing the record.
 */
function Record(context, options) {
    if (options.resource_type == undefined) options.resource_type = null;
    if (options.backing == undefined) options.backing = {};

    this.context = context;
    this.resource_type = options.resource_type;
    this.backing = options.backing;

    /**
     * Saves this record to the TaguchiMail database.
     */
    this.update = function() {
        var data = [this.backing];
        var results = JSON.parse(this.context.make_request(this.resource_type,
            "PUT", {record_id: this.backing["id"], data: JSON.stringify(data)}));
        this.backing = results[0];
    }   

    /**
     * Creates this record in TaguchiMail database.
     */
    this.create = function() {
        var data = [this.backing];
        var results = JSON.parse(this.context.make_request(this.resource_type, 
            "POST", {data: JSON.stringify(data)}));
        this.backing = results[0];
    }   
}

/**
 * Models a campaign in TaguchiMail.
 *
 * context: Context
 *     Determines the TM instance and organization to which the campaign belongs.
 */
function Campaign(context) {

    this.super = Record;
    this.super(context, {resource_type: "campaign"});

    this.record_id = function() {           // id 
        return String(this.backing["id"]); 
    }

    this.ref = function(value) {            // ref
        if (value == undefined) 
            return String(this.backing["ref"]);
        else 
            this.backing["ref"] = value;
    }

    this.name = function(value) {           // name
        if (value == undefined) 
            return String(this.backing["name"]);
        else 
            this.backing["name"] = value;
    }   
 
    this.start_datetime = function(value) { // date
        if (value == undefined) 
            return String(this.backing["date"]);
        else 
            this.backing["date"] = value;
    }   
 
    this.xml_data = function(value) {       // data
        if (value == undefined) 
            return String(this.backing["data"]);
        else 
            this.backing["data"] = value;
    }   
 
    this.status = function() {              // status
        return String(this.backing["status"]);
    }   
}

/**
 * Retrieves a single Campaign based on its TaguchiMail identifier.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * record_id: string/integer
 *     Contains the list's unique TaguchiMail identifier.
 * parameters: associative array
 *     Contains additional parameters to the request.
 */
Campaign.get = function(context, record_id, parameters) {
    var results = JSON.parse(context.make_request("campaign", "GET",
        {record_id: record_id, parameters: parameters}));
    var record = new Campaign(context);
    record.backing = results[0];
    return record;
}

/**
 * Retrieves a list of Campaign(s) based on a query.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * sort: string
 *     Indicates which of the record's fields should be used to sort the output
 * order: string
 *     Contains either 'asc' or 'desc', indicating whether the result list
 *     should be returned in ascending or descending order.
 * offset: string/integer
 *     Indicates the index of the first record to be returned in the list
 * limit: string/integer
 *     Indicates the maximum number of records to return.
 * query: array
 *     Contains query predicates, each of the form: [field]-[operator]-[value]
 *     where [field] is one of the defined resource fields, [operator] is one
 *     of the below-listed comparison operators, and [value] is a string value 
 *     to which the field should be compared.
 *
 *     Supported operators:
 *     * eq: mapped to SQL '=', test for equality between [field] and [value] 
 *       (case-sensitive for strings);
 *     * neq: mapped to SQL '!=', test for inequality between [field] and 
 *       [value] (case-sensitive for strings);
 *     * lt: mapped to SQL '<', test if [field] is less than [value];
 *     * gt: mapped to SQL '>', test if [field] is greater than [value];
 *     * lte: mapped to SQL '<=', test if [field] is less than or equal to 
 *       [value];
 *     * gte: mapped to SQL '>=', test if [field] is greater than or equal to 
 *       [value];
 *     * re: mapped to PostgreSQL '~', interprets [value] as POSIX regular 
 *       expression and test if [field] matches it;
 *     * rei: mapped to PostgreSQL '~*', performs a case-insensitive POSIX 
 *       regular expression match;
 *     * like: mapped to SQL 'LIKE' (case-sensitive);
 *     * is: mapped to SQL 'IS', should be used to test for NULL values in the 
 *       database as [field]-eq-null is always false;
 *     * nt: mapped to SQL 'IS NOT', should be used to test for NOT NULL values 
 *       in the database as [field]-neq-null is always false.
 */
Campaign.find = function(context, sort, order, offset, limit, query) {
    var parameters = {sort: sort, order: order, offset: String(offset),
        limit: String(limit)};
    var results = JSON.parse(context.make_request("campaign", "GET",
        {parameters: parameters, query: query}));
    var records = [];
    for (var i = 0; i < results.length; i++) {
        var record = new Campaign(context);
        record.backing = results[i];
        records.push(record);
    }
    return records;
}

/**
 * Models a revision of activity in TaguchiMail.
 *
 * activity: Activity
 *     The activity of this revision.
 * revision: associative array
 *     The data backing the record.
 */
function ActivityRevision(activity, revision) {

    this.activity = activity;
    this.backing = revision || {};

    this.record_id = function() {               // id
        return String(this.backing["id"]);
    }
   
    this.content = function() {                 // content
        return String(this.backing["content"]);
    }   

    this.approval_status = function(value) {    // approval status
        if (value == undefined) 
            return String(this.backing["approval_status"]);
        else 
            this.backing["approval_status"] = value;
    }
}

/**
 * Models an activity in TaguchiMail.
 *
 * context: Context
 *     Determines the TM instance and organization to which the activity belongs.
 */
function Activity(context) {

    this.super = Record;
    this.super(context, {resource_type: "activity"});
    this.existing_revisions = []; 

    this.record_id = function() {               // id
        return String(this.backing["id"]);
    }   

    this.ref = function(value) {                // ref
        if (value == undefined) 
            return String(this.backing["ref"]);
        else 
            this.backing["ref"] = value;
    }   

    this.name = function(value) {               // name
        if (value == undefined) 
            return String(this.backing["name"]);
        else 
            this.backing["name"] = value;
    }

    this.type = function(value) {               // type
        if (value == undefined) 
            return String(this.backing["type"]);
        else 
            this.backing["type"] = value;
    }

    this.subtype = function(value) {            // subtype
        if (value == undefined) 
            return String(this.backing["subtype"]);
        else 
            this.backing["subtype"] = value;
    }

    this.target_lists = function(value) {       // target_list
        if (value == undefined) 
            return String(this.backing["target_lists"]);
         else 
            this.backing["target_lists"] = value;
    }

    this.target_views = function(value) {       // target_views
        if (value == undefined) 
            return String(this.backing["target_views"]);
        else 
            this.backing["target_views"] = value;
    }

    this.approval_status = function(value) {    // approval_status
        if (value == undefined) 
            return String(this.backing["approval_status"]);
        else 
            this.backing["approval_status"] = value;
    }

    this.deploy_datetime = function(value) {    // date
        if (value == undefined)
            return String(this.backing["date"]);
        else
            this.backing["date"] = value;
    }

    this.template_id = function(value) {        // template_id
        if (value == undefined) 
            return String(this.backing["template_id"]);
        else 
            this.backing["template_id"] = value;
    }

    this.campaign_id = function(value) {        // campaign_id
        if (value == undefined) 
            return String(this.backing["campaign_id"]);
        else 
            this.backing["campaign_id"] = value;
    }

    this.throttle = function(value) {           // throttle
        if (value == undefined) 
            return parseInt(this.backing["throttle"]);
        else 
            this.backing["throttle"] = value;
    }

    this.xml_data = function(value) {           // data
        if (value == undefined) 
            return String(this.backing["data"]);
        else 
            this.backing["data"] = value;
    }

    this.status = function() {                  // status
        return String(this.backing["status"]);
    }

    this.latest_revision = function(value) {    // revisions
        if (value == undefined) {
            if (this.backing["revisions"].length > 0) 
                return new ActivityRevision(this, this.backing["revisions"][0]);
            else if (this.existing_revisions.length > 0) 
                return new ActivityRevision(this, this.existing_revisions[0]);
            else 
                return null;
        } else { 
            var revision = {content: value.content};
            if (this.backing["revisions"].length > 0) 
                this.backing["revisions"][0] = revision;
            else 
                this.backing["revisions"].push(revision);
        }
    }

    /**
     * Saves this activity to the TagchiMail database.
     */
    this.update_in_super = this.update;
    this.update = function() {
        this.update_in_super();
        this.existing_revisions = this.backing["revisions"];
        this.backing["revisions"] = [];
    }

    /**
     * Creates this activity in the TaguchiMail database.
     */
    this.create_in_super = this.create;
    this.create = function() {
        this.create_in_super();
        this.existing_revisions = this.backing["revisions"];
        this.backing["revisions"] = [];
    }

    /**
     * Sends a proof message for an activity record to the list with the
     * specified ID/to a specific list.
     *
     * list: string/SubscriberList
     *     Indicates List ID of the proof list/the list to which the messages
     *     will be sent.
     * tag: string
     *     Displays at the start of the subject line.
     * message: string
     *     Contains a custom message which will be included in the proof header.
     */
    this.proof = function(list, tag, message) {
        if (typeof list == "string") {
            var data = [{id: this.record_id, list_id: list, tag: tag, 
                message: message}];
            this.context.make_request(this.resource_type, "PROOF",
                {record_id: this.backing["id"], data: JSON.stringify(data)});
        } else {
            this.proof(list.record_id, tag, message);
        }
    }

    /**
     * Sends an approval request for an activity record to the list with the
     * specified ID/to a specific list.
     *
     * list: string/SubscriberList
     *     Indicates List ID of the approval list/the list to which the
     *     approval request will be sent.
     * tag: string
     *     Displays at the start of the subject line.
     * message: string
     *     Contains a custom message which will be included in the approval 
     *     header.
     */
    this.request_approval = function(list, tag, message) {
        if (typeof list == "string") {
            var data = [{id: this.record_id, list_id: list, tag: tag, 
                message: message}];
            this.context.make_request(this.resource_type, "APPROVAL",
                {record_id: this.backing["id"], data: JSON.stringify(data)});
        } else {
            this.request_approval(list.record_id, tag, message);
        }
    }

    /**
     * Triggers the activity, causing it to be delivered to a specified list of 
     * subscribers.
     *
     * subscribers: array
     *     Contains subscriber IDs/Subscriber(s) to whom the message should be
     *     delivered.
     * request_content: string
     *     XML content for message customization. The request_content document 
     *     is available to the activity template's stylesheet, in addition to 
     *     the revision's content. Should be None if unused.
     * test: boolean
     *     Determines whether or not to treat this as a test send.
     */
    this.trigger = function(subscribers, request_content, test) {
        if (typeof subscribers[0] == "string") {
            var data = [{id: this.record_id, test: (test) ? 1 : 0,
                request_content: request_content, condition: subscribers}];
            this.context.make_request(this.resource_type, "TRIGGER",
                {record_id: this.backing["id"], data: JSON.stringify(data)});
        } else {
            var subscriber_ids = [];
            for (var i = 0; i < subscribers.length; i++) {
                subscriber_ids.push(subscribers[i].record_id);
            }
            this.trigger(subscriber_ids, request_content, test);
        }
    }
}

/**
 * Retrieves a single Activity based on its TaguchiMail identifier.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * record_id: string/integer
 *     Contains the list's unique TaguchiMail identifier.
 * parameters: associative array
 *     Contains additional parameters to the request.
 */
Activity.get = function(context, record_id, parameters) {
    var results = JSON.parse(context.make_request("activity", "GET",
        {record_id: record_id, parameters: parameters}));
    var record = new Activity(context);
    record.backing = results[0];
    record.existing_revisions = record.backing["revisions"];
    record.backing["revisions"] = [];
    return record;
}

/**
 * Retrieves a single Activity based on its TaguchiMail identifier, with its
 * latest revision content.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * record_id: string/integer
 *     Contains the list's unique TaguchiMail identifier.
 */
Activity.get_with_content = function(context, record_id) {
    return Activity.get(context, record_id, {revision: "latest"});
}

/**
 * Retrieves a list of Activity(s) based on a query.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * sort: string
 *     Indicates which of the record's fields should be used to sort the output
 * order: string
 *     Contains either 'asc' or 'desc', indicating whether the result list
 *     should be returned in ascending or descending order.
 * offset: string/integer
 *     Indicates the index of the first record to be returned in the list
 * limit: string/integer
 *     Indicates the maximum number of records to return.
 * query: array
 *     Contains query predicates, each of the form: [field]-[operator]-[value]
 *     where [field] is one of the defined resource fields, [operator] is one
 *     of the below-listed comparison operators, and [value] is a string value 
 *     to which the field should be compared.
 *
 *     Supported operators:
 *     * eq: mapped to SQL '=', test for equality between [field] and [value] 
 *       (case-sensitive for strings);
 *     * neq: mapped to SQL '!=', test for inequality between [field] and 
 *       [value] (case-sensitive for strings);
 *     * lt: mapped to SQL '<', test if [field] is less than [value];
 *     * gt: mapped to SQL '>', test if [field] is greater than [value];
 *     * lte: mapped to SQL '<=', test if [field] is less than or equal to 
 *       [value];
 *     * gte: mapped to SQL '>=', test if [field] is greater than or equal to 
 *       [value];
 *     * re: mapped to PostgreSQL '~', interprets [value] as POSIX regular 
 *       expression and test if [field] matches it;
 *     * rei: mapped to PostgreSQL '~*', performs a case-insensitive POSIX 
 *       regular expression match;
 *     * like: mapped to SQL 'LIKE' (case-sensitive);
 *     * is: mapped to SQL 'IS', should be used to test for NULL values in the 
 *       database as [field]-eq-null is always false;
 *     * nt: mapped to SQL 'IS NOT', should be used to test for NOT NULL values 
 *       in the database as [field]-neq-null is always false.
 */
Activity.find = function(context, sort, order, offset, limit, query) {
    var parameters = {sort: sort, order: order, offset: String(offset),
        limit: String(limit)};
    var results = JSON.parse(context.make_request("activity", "GET",
        {parameters: parameters, query: query}));
    var records = [];
    for (var i = 0; i < results.length; i++) {
        var record = new Activity(context);
        record.backing = results[i];
        record.existing_revisions = record.backing["revisions"];
        record.backing["revisions"] = [];
        records.push(record);
    }
    return records;
}

/**
 * Models a revision of template in TaguchiMail.
 *
 * activity: Activity
 *     The activity of this revision.
 * revision: associative array
 *     The data backing the record.
 */
function TemplateRevision(template, format, revision) {
    
    this.template = template;
    this.format = format || null;
    this.backing = revision || {};

    this.record_id = function() {       // id
        return String(this.backing["id"]);
    }
   
    this.format = function(value) {     // format
        if (value == undefined) 
            return String(this.backing["format"]);
        else 
            this.backing["format"] = value;
    }   

    this.content = function(value) {    // content
        if (value == undefined) 
            return String(this.backing["content"]);
        else 
            this.backing["content"] = value;
    }
}

/**
 * Models a template in TaguchiMail.
 *
 * context: Context
 *     Determines the TM instance and organization to which the template belongs.
 */
function Template(context) {

    this.super = Record;
    this.super(context, {resource_type: "template"});
    this.existing_revisions = []; 

    this.record_id = function() {       // id
        return String(this.backing["id"]);
    }   

    this.ref = function(value) {        // ref
        if (value == undefined) 
            return String(this.backing["ref"]);
        else 
            this.backing["ref"] = value;
    }   

    this.name = function(value) {       // name
        if (value == undefined) 
            return String(this.backing["name"]);
        else 
            this.backing["name"] = value;
    }

    this.type = function(value) {       // type
        if (value == undefined) 
            return String(this.backing["type"]);
        else 
            this.backing["type"] = value;
    }

    this.subtype = function(value) {    // subtype
        if (value == undefined) 
            return String(this.backing["subtype"]);
        else 
            this.backing["subtype"] = value;
    }

    this.xml_data = function(value) {   // data
        if (value == undefined) 
            return String(this.backing["data"]);
        else
            this.backing["data"] = value;
    }

    this.status = function() {          // status
        return String(this.backing["status"]);
    }

    this.latest_revision = function(value) {    // revisions
        if (value == undefined) {
            if (this.backing["revisions"].length > 0) 
                return new TemplateRevision(this, null, this.backing["revisions"][0]);
            else if (this.existing_revisions.length > 0) 
                return new TemplateRevision(this, null, this.existing_revisions[0]);
            else 
                return null;
        } else { 
            var revision = {content: value.content, format: value.format};
            if (this.backing["revisions"].length > 0) 
                this.backing["revisions"][0] = revision;
            else 
                this.backing["revisions"].push(revision);
        }
    }

    /**
     * Saves this template to the TaguchiMail database.
     */
    this.update_in_super = this.update;
    this.update = function() {
        this.update_in_super();
        this.existing_revisions = this.backing["revisions"];
        this.backing["revision"] = [];
    }

    /**
     * Creates this template in the TaguchiMail database.
     */
    this.create_in_super = this.create;
    this.create = function() {
        this.create_in_super();
        this.existing_revisions = this.backing["revisions"];
        this.backing["revision"] = [];
    }
}

/**
 * Retrieves a single Template based on its TaguchiMail identifier.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * record_id: string/integer
 *     Contains the list's unique TaguchiMail identifier.
 * parameters: associative array
 *     Contains additional parameters to the request.
 */
Template.get = function(context, record_id, parameters) {
    var results = JSON.parse(context.make_request("template", "GET",
        {record_id: record_id, parameters: parameters}));
    var record = new Template(context);
    record.backing = results[0];
    record.existing_revisions = record.backing["revisions"];
    record.backing["revisions"] = [];
    return record;
}

/**
 * Retrieves a single Template based on its TaguchiMail identifier, with its
 * latest revision content.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * record_id: string/integer
 *     Contains the list's unique TaguchiMail identifier.
 */
Template.get_with_content = function(context, record_id, parameters) {
    return Template.get(context, record_id, {revision: "latest"});
}

/**
 * Retrieves a list of Template(s) based on a query.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * sort: string
 *     Indicates which of the record's fields should be used to sort the output
 * order: string
 *     Contains either 'asc' or 'desc', indicating whether the result list
 *     should be returned in ascending or descending order.
 * offset: string/integer
 *     Indicates the index of the first record to be returned in the list
 * limit: string/integer
 *     Indicates the maximum number of records to return.
 * query: array
 *     Contains query predicates, each of the form: [field]-[operator]-[value]
 *     where [field] is one of the defined resource fields, [operator] is one
 *     of the below-listed comparison operators, and [value] is a string value 
 *     to which the field should be compared.
 *
 *     Supported operators:
 *     * eq: mapped to SQL '=', test for equality between [field] and [value] 
 *       (case-sensitive for strings);
 *     * neq: mapped to SQL '!=', test for inequality between [field] and 
 *       [value] (case-sensitive for strings);
 *     * lt: mapped to SQL '<', test if [field] is less than [value];
 *     * gt: mapped to SQL '>', test if [field] is greater than [value];
 *     * lte: mapped to SQL '<=', test if [field] is less than or equal to 
 *       [value];
 *     * gte: mapped to SQL '>=', test if [field] is greater than or equal to 
 *       [value];
 *     * re: mapped to PostgreSQL '~', interprets [value] as POSIX regular 
 *       expression and test if [field] matches it;
 *     * rei: mapped to PostgreSQL '~*', performs a case-insensitive POSIX 
 *       regular expression match;
 *     * like: mapped to SQL 'LIKE' (case-sensitive);
 *     * is: mapped to SQL 'IS', should be used to test for NULL values in the 
 *       database as [field]-eq-null is always false;
 *     * nt: mapped to SQL 'IS NOT', should be used to test for NOT NULL values 
 *       in the database as [field]-neq-null is always false.
 */
Template.find = function(context, sort, order, offset, limit, query) {
    var parameters = {sort: sort, order: order, offset: String(offset),
        limit: String(limit)};
    var results = JSON.parse(context.make_request("template", "GET",
        {parameters: parameters, query: query}));
    var records = [];
    for (var i = 0; i < results.length; i++) {
        var record = new Template(context);
        record.backing = results[i];
        record.existing_revisions = record.backing["revisions"];
        record.backing["revisions"] = [];
        records.push(record);
    }
    return records;
}

/**
 * Models an subscriber in TaguchiMail.
 *
 * context: Context
 *     Determines the TM instance and organization to which the activity belongs.
 */
function Subscriber(context) {

    this.super = Record;
    this.super(context, {resource_type: "subscriber"});

    this.record_id = function() {                   // id
        return String(this.backing["id"]);
    }   

    this.ref = function(value) {                    // ref
        if (value == undefined) 
            return String(this.backing["ref"]);
        else 
            this.backing["ref"] = value;
    }   

    this.title = function(value) {                  // title
        if (value == undefined) 
            return String(this.backing["title"]);
        else 
            this.backing["title"] = value;
    }   

    this.firstname = function(value) {              // firstname
        if (value == undefined) 
            return String(this.backing["firstname"]);
        else 
            this.backing["firstname"] = value;
    }   

    this.lastname = function(value) {               // lastname
        if (value == undefined) 
            return String(this.backing["lastname"]);
        else 
            this.backing["lastname"] = value;
    }   

    this.notifications = function(value) {          // notifications
        if (value == undefined) 
            return String(this.backing["notifications"]);
        else 
            this.backing["notifications"] = value;
    }

    this.extra = function(value) {                  // extra
        if (value == undefined) 
            return String(this.backing["extra"]);
        else 
            this.backing["extra"] = value;
    }

    this.phone = function(value) {                  // phone
        if (value == undefined) 
            return String(this.backing["phone"]);
        else 
            this.backing["phone"] = value;
    }

    this.dob = function(value) {                    // dob
        if (value == undefined) 
            return String(this.backing["dob"]);
        else 
            this.backing["dob"] = value;
    }

    this.address = function(value) {                // address
        if (value == undefined) 
            return String(this.backing["address"]);
        else 
            this.backing["address"] = value;
    }

    this.address2 = function(value) {               // address2
        if (value == undefined) 
            return String(this.backing["address2"]);
        else 
            this.backing["address2"] = value;
    }

    this.address3 = function(value) {               // address3
        if (value == undefined) 
            return String(this.backing["address3"]);
        else 
            this.backing["address3"] = value;
    }

    this.suburb = function(value) {                 // suburb
        if (value == undefined) 
            return String(this.backing["suburb"]);
        else 
            this.backing["suburb"] = value;
    }

    this.state = function(value) {                  // state
        if (value == undefined) 
            return String(this.backing["state"]);
        else 
            this.backing["state"] = value;
    }

    this.country = function(value) {                // country
        if (value == undefined) 
            return String(this.backing["country"]);
        else 
            this.backing["country"] = value;
    }

    this.postcode = function(value) {               // postcode
        if (value == undefined) 
            return String(this.backing["postcode"]);
        else 
            this.backing["postcode"] = value;
    }

    this.gender = function(value) {                 // gender
        if (value == undefined) 
            return String(this.backing["gender"]);
        else 
            this.backing["gender"] = value;
    }

    this.email = function(value) {                  // email
        if (value == undefined) 
            return String(this.backing["email"]);
        else 
            this.backing["email"] = value;
    }

    this.social_rating = function() {               // social_rating
        return String(this.backing["social_rating"]);
    }

    this.social_profile = function() {              // social_profile
        return String(this.backing["social_profile"]);
    }

    this.unsubscribe_datetime = function(value) {   // unsubscribed
        if (value == undefined) 
            return String(this.backing["unsubscribed"]);
        else 
            this.backing["unsubscribed"] = value;
    }

    this.bounce_datetime = function(value) {        // bounced
        if (value == undefined) 
            return String(this.backing["bounced"]);
        else 
            this.backing["bounced"] = value;
    }

    this.xml_data = function(value) {               // data
        if (value == undefined) 
            return String(this.backing["data"]);
        else 
            this.backing["data"] = value;
    }

    /**
     * Retrieves a custom field value by field name.
     *
     * field: string
     *     Indicates the custom field to retrieve.
     */
    this.get_custom_field = function(field) {
        if (this.backing["custom_fields"] == undefined) 
            this.backing["custom_fields"] = [];
        for (var i = 0; i < this.backing["custom_fields"].length; i++) {
            var field_data = this.backing["custom_fields"][i];
            if (String(field_data["field"]) == field) 
                return String(field_data["data"]);
        }
        return null;
    }

    /**
     * Sets a custom field value by field.
     *
     * field: string
     *     Contains the name of the field to set. If a field with that name is
     *     already defined for this subscriber, the new value will overwrite the 
     *     old one.
     * data: string
     *     Contains the field's data. If a field is intended to store array or 
     *     other complex data types, this should be JSON-encoded (or serialized 
     *     to XML depending on application preference).
     */
    this.set_custom_field = function(field, data) {
        if (this.backing["custom_fields"] == undefined) 
            this.backing["custom_fields"] = [];
        for (var i = 0; i < this.backing["custom_fields"].length; i++) {
            var field_data = this.backing["custom_fields"][i];
            if (String(field_data["field"]) == field) {
                field_data["data"] = data;
                return;
            }
        }
        this.backing["custom_fields"].push({field: field, data: data});
    }

    /**
     * Checks the subscription status of a specific list.
     *
     * list: string/SubscriberList
     *     Contains the list ID/list to check subscription status for.
     */
    this.is_subscribed_to_list = function(list) {
        if (typeof list == "string") {
            if (this.backing["lists"] == undefined) 
                this.backing["lists"] = [];
            for (var i = 0; i < this.backing["lists"].length; i++) {
                var item = this.backing["lists"][i];
                if (String(item["list_id"]) == list) 
                    return item["unsubscribed"] == null;
            }
            return false;
        } else {
            return this.is_subscribed_to_list(list.record_id());
        }
    }

    /**
     * Retrieves the subscription option (arbitrary application data) for a
     * specific list.
     *
     * list: string/SubscriberList
     *     Contains the list ID/list to retrieve subscription option for.
     */
    this.get_subscription_option = function(list) {
        if (typeof list == "string") {
            if (this.backing["lists"] == undefined)
                this.backing["lists"] = [];
            for (var i = 0; i < this.backing["lists"].length; i++) {
                var item = this.backing["lists"][i];
                if (String(item["list_id"]) == list)
                    return String(item["option"]);
            }
            return null;
        } else {
            return this.get_subscription_option(list.record_id());
        }
    }

    /**
     * Checks the unsubscription status of a specific list.
     *
     * list: string/SubscriberList
     *     Contains the list ID/list to check unsubscription status for.
     */
    this.is_unsubscribed_from_list = function(list) {
        if (typeof list == "string") {
            if (this.backing["lists"] == undefined) 
                this.backing["lists"] = [];
            for (var i = 0; i < this.backing["lists"].length; i++) {
                var item = this.backing["lists"][i];
                if (String(item["list_id"]) == list) 
                    return item["unsubscribed"] != null;
            }
            return false;
        } else {
            return this.is_unsubscribed_from_list(list.record_id());
        }
    }

    /**
     * Retrieves all list ids to which this record is subscribed.
     */
    this.get_subscribed_list_ids = function() {
        if (this.backing["lists"] == undefined) 
            this.backing["lists"] = [];
        var lists = [];
        for (var i = 0; i < this.backing["lists"].length; i++) {
            var list = this.backing["lists"][i];
            if (list["unsubscribed"] == null) 
                lists.push(String(list["list_id"]));
        }
        return lists;
    }

    /**
     * Retrieves all list (SubscriberList) to which this record is subscribed.
     */
    this.get_subscribed_lists = function() {
        var list_ids = this.get_subscribed_list_ids();
        var lists = [];
        for (var i = 0; i < this.list_ids.length; i++) {
            var list_id = this.list_ids[i];
            lists.push(SubscriberList.get(this.context, list_id, null));
        }
        return lists;
    }

    /**
     * Retrieves all list ids to which this record is unsubscribed.
     */
    this.get_unsubscribed_list_ids = function() {
        if (this.backing["lists"] == undefined) 
            this.backing["lists"] = [];
        var lists = [];
        for (var i = 0; i < this.backing["lists"].length; i++) {
            var list = this.backing["lists"][i];
            if (list["unsubscribed"] != null) 
                lists.push(String(list["list_id"]));
        }
        return lists;
    }

    /**
     * Retrieves all list (SubscriberList) to which this record is unsubscribed.
     */
    this.get_unsubscribed_lists = function() {
        var list_ids = this.get_unsubscribed_list_ids();
        var lists = [];
        for (var i = 0; i < this.list_ids.length; i++) {
            var list_id = this.list_ids[i];
            lists.push(SubscriberList.get(this.context, list_id, null));
        }
        return lists;
    }

    /**
     * Adds the subscriber to a specific list, resetting the unsubscribe flag if
     * previously set.
     *
     * list: string/SubscriberList
     *     Contains the list ID/list which should be added.
     * option: string
     *     Contains the list subscription option (arbitrary application data).
     */
    this.subscribe_to_list = function(list, option) {
        if (typeof list == "string") {
            if (this.backing["lists"] == undefined) 
                this.backing["lists"] = [];
            for (var i = 0; i < this.backing["lists"].length; i++) {
                var item = this.backing["lists"][i];
                if (String(item["list_id"]) == list) {
                    item["option"] = option;
                    item["unsubscribed"] = null;
                    return;
                }
            }
            this.backing["lists"].push({list_id: parseInt(list), option: option});
        } else {
            return this.subscribe_to_list(list.record_id(), option);
        }
    }

    /**
     * Unsubscribe from a specific list, adding the list if not already 
     * subscribed.
     *
     * list: string/SubscriberList
     *     Contains the list ID/list from which the record should be unsubscribed.
     */
    this.unsubscribe_from_list = function(list) {
        if (typeof list == "string") {
            var d = new Date();
            var now = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            now += "T" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            if (this.backing["lists"] == undefined) 
                this.backing["lists"] = [];
            for (var i = 0; i < this.backing["lists"].length; i++) {
                var item = this.backing["lists"][i];
                if (String(item["list_id"]) == list && item["unsubscribed"] == null) {
                    item["unsubscribed"] = now;
                    return;
                }
            }
            this.backing["lists"].push({list_id: parseInt(list), unsubscribed: now});
        } else {
            return this.unsubscribe_from_list(list.record_id());
        }
    }

    /**
     * Creates this record in the TaguchiMail database if it doesn't already
     * exist (based on a search for records with the same ref of email in that
     * order). If it does, simply update what's already in the database. Fields 
     * not written to the backing store (via property update) will not be over-
     * written in the database.
     */
    this.create_or_update = function() {
        var data = [this.backing];
        var results = JSON.parse(this.context.make_request(this.resource_type,
            "CREATEORUPDATE", {data: JSON.stringify(data)}));
        this.backing = results[0];
    }
}

/**
 * Retrieves a single Subscriber based on its TaguchiMail identifier.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * record_id: string/integer
 *     Contains the list's unique TaguchiMail identifier.
 * parameters: associative array
 *     Contains additional parameters to the request.
 */
Subscriber.get = function(context, record_id, parameters) {
    var results = JSON.parse(context.make_request("subscriber", "GET",
        {record_id: record_id, parameters: parameters}));
    var record = new Subscriber(context);
    record.backing = results[0];
    return record;
}

/**
 * Retrieves a list of Subscriber(s) based on a query.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * sort: string
 *     Indicates which of the record's fields should be used to sort the output
 * order: string
 *     Contains either 'asc' or 'desc', indicating whether the result list
 *     should be returned in ascending or descending order.
 * offset: string/integer
 *     Indicates the index of the first record to be returned in the list
 * limit: string/integer
 *     Indicates the maximum number of records to return.
 * query: array
 *     Contains query predicates, each of the form: [field]-[operator]-[value]
 *     where [field] is one of the defined resource fields, [operator] is one
 *     of the below-listed comparison operators, and [value] is a string value 
 *     to which the field should be compared.
 *
 *     Supported operators:
 *     * eq: mapped to SQL '=', test for equality between [field] and [value] 
 *       (case-sensitive for strings);
 *     * neq: mapped to SQL '!=', test for inequality between [field] and 
 *       [value] (case-sensitive for strings);
 *     * lt: mapped to SQL '<', test if [field] is less than [value];
 *     * gt: mapped to SQL '>', test if [field] is greater than [value];
 *     * lte: mapped to SQL '<=', test if [field] is less than or equal to 
 *       [value];
 *     * gte: mapped to SQL '>=', test if [field] is greater than or equal to 
 *       [value];
 *     * re: mapped to PostgreSQL '~', interprets [value] as POSIX regular 
 *       expression and test if [field] matches it;
 *     * rei: mapped to PostgreSQL '~*', performs a case-insensitive POSIX 
 *       regular expression match;
 *     * like: mapped to SQL 'LIKE' (case-sensitive);
 *     * is: mapped to SQL 'IS', should be used to test for NULL values in the 
 *       database as [field]-eq-null is always false;
 *     * nt: mapped to SQL 'IS NOT', should be used to test for NOT NULL values 
 *       in the database as [field]-neq-null is always false.
 */
Subscriber.find = function(context, sort, order, offset, limit, query) {
    var parameters = {sort: sort, order: order, offset: String(offset),
        limit: String(limit)};
    var results = JSON.parse(context.make_request("subscriber", "GET",
        {parameters: parameters, query: query}));
    var records = [];
    for (var i = 0; i < results.length; i++) {
        var record = new Subscriber(context);
        record.backing = results[i];
        records.push(record);
    }
    return records;
}

/**
 * Models an subscriber list in TaguchiMail.
 *
 * context: Context
 *     Determines the TM instance and organization to which the activity belongs.
 */
function SubscriberList(context) {

    this.super = Record;
    this.super(context, {resource_type: "list"});

    this.record_id = function() {           // id
        return String(this.backing["id"]);
    }

    this.ref = function(value) {            // ref
        if (value == undefined) 
            return String(this.backing["ref"]);
        else 
            this.backing["ref"] = value;
    }

    this.name = function(value) {           // name
        if (value == undefined) 
            return String(this.backing["name"]);
        else 
            this.backing["name"] = value;
    }

    this.type = function(value) {           // type
        if (value == undefined) 
            return String(this.backing["type"]);
        else 
            this.backing["type"] = value;
    }

    this.creation_datetime = function() {   // timestamp
        return String(this.backing["timestamp"]);
    }

    this.xml_data = function(value) {       // data
        if (value == undefined) 
            return String(this.backing["data"]);
        else 
            this.backing["data"] = value;
    }

    this.status = function() {              // status
        return String(this.backing["status"]);
    }

    /**
     * Adds a subscriber to this list with an application-defined subscription 
     * option.
     *
     * subscriber: Subscriber
     *     A subscriber to add.
     * option: string
     *     A subscription option.
     */
    this.subscribe_subscriber = function(subscriber, option) {
        subscriber.subscribe_to_list(this, option)
    }

    /**
     * Unsubscribes a subscriber from this list (adding it first if necessary).
     *
     * subscriber: Subscriber
     *     A subscriber to unsubscribe.
     */
    this.unsubscribe_subscriber = function(subscriber) {
        subscriber.unsubscribe_from_list(this)
    }

    /**
     * Retrieves (limit) subscribers to this list (regardless of opt-in/opt-out 
     * status), starting with the (offset)th subscriber.
     */
    this.get_subscribers = function(offset, limit) {
        return Subscriber.find(this.context, "id", "asc", offset, limit,
            ["list_id-eq-" + this.record_id])
    }
}

/**
 * Retrieves a single SubscriberList based on its TaguchiMail identifier.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * record_id: string/integer
 *     Contains the list's unique TaguchiMail identifier.
 * parameters: associative array
 *     Contains additional parameters to the request.
 */
SubscriberList.get = function(context, record_id, parameters) {
    var results = JSON.parse(context.make_request("list", "GET",
        {record_id: record_id, parameters: parameters}));
    var record = new SubscriberList(context);
    record.backing = results[0];
    return record;
}

/**
 * Retrieves a list of SubscriberList(s) based on a query.
 *
 * context: Context
 *     Determines the TM instance and organization to query.
 * sort: string
 *     Indicates which of the record's fields should be used to sort the output
 * order: string
 *     Contains either 'asc' or 'desc', indicating whether the result list
 *     should be returned in ascending or descending order.
 * offset: string/integer
 *     Indicates the index of the first record to be returned in the list
 * limit: string/integer
 *     Indicates the maximum number of records to return.
 * query: array
 *     Contains query predicates, each of the form: [field]-[operator]-[value]
 *     where [field] is one of the defined resource fields, [operator] is one
 *     of the below-listed comparison operators, and [value] is a string value 
 *     to which the field should be compared.
 *
 *     Supported operators:
 *     * eq: mapped to SQL '=', test for equality between [field] and [value] 
 *       (case-sensitive for strings);
 *     * neq: mapped to SQL '!=', test for inequality between [field] and 
 *       [value] (case-sensitive for strings);
 *     * lt: mapped to SQL '<', test if [field] is less than [value];
 *     * gt: mapped to SQL '>', test if [field] is greater than [value];
 *     * lte: mapped to SQL '<=', test if [field] is less than or equal to 
 *       [value];
 *     * gte: mapped to SQL '>=', test if [field] is greater than or equal to 
 *       [value];
 *     * re: mapped to PostgreSQL '~', interprets [value] as POSIX regular 
 *       expression and test if [field] matches it;
 *     * rei: mapped to PostgreSQL '~*', performs a case-insensitive POSIX 
 *       regular expression match;
 *     * like: mapped to SQL 'LIKE' (case-sensitive);
 *     * is: mapped to SQL 'IS', should be used to test for NULL values in the 
 *       database as [field]-eq-null is always false;
 *     * nt: mapped to SQL 'IS NOT', should be used to test for NOT NULL values 
 *       in the database as [field]-neq-null is always false.
 */
SubscriberList.find = function(context, sort, order, offset, limit, query) {
    var parameters = {sort: sort, order: order, offset: String(offset),
        limit: String(limit)};
    var results = JSON.parse(context.make_request("list", "GET",
        {parameters: parameters, query: query}));
    var records = [];
    for (var i = 0; i < results.length; i++) {
        var record = new Subscriber(context);
        record.backing = results[i];
        records.push(record);
    }
    return records;
}
