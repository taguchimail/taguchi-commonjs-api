var api = require("api");
var qunit = require("qunit");

qunit.module("api/context");

qunit.test("test_make_request_with_data", function() {

});

qunit.test("test_make_request_without_data", function() {

});

qunit.module("api/record");

qunit.test("test_update", function() {

});

qunit.test("test_create", function() {

});

qunit.module("api/campaign");

qunit.test("test_record_id", function() {
    qunit.expect(1);
    var record = new api.Campaign();
    record.backing = {id: 1};
    qunit.equal("1", record.record_id());
});

qunit.test("test_ref", function() {
    qunit.expect(1);
    var record = new api.Campaign();
    record.ref("x");
    qunit.equal("x", record.ref());
});

qunit.test("test_name", function() {
    qunit.expect(1);
    var record = new api.Campaign();
    record.name("x");
    qunit.equal("x", record.name());
});

qunit.test("test_start_datetime", function() {
    qunit.expect(1);
    var record = new api.Campaign();
    record.start_datetime("x");
    qunit.equal("x", record.start_datetime());
});

qunit.test("test_xml_data", function() {
    qunit.expect(1);
    var record = new api.Campaign();
    record.xml_data("x");
    qunit.equal("x", record.xml_data());
});

qunit.test("test_status", function() {
    qunit.expect(1);
    var record = new api.Campaign();
    record.backing = {status: "x"};
    qunit.equal("x", record.status());
});

qunit.test("test_static_get", function() {

});

qunit.test("test_static_find", function() {

});

qunit.module("api/activity_revision");

qunit.test("test_record_id", function() {
    qunit.expect(1);
    var record = new api.ActivityRevision();
    record.backing = {id: 1};
    qunit.equal("1", record.record_id());
});

qunit.test("test_content", function() {
    qunit.expect(1);
    var record = new api.ActivityRevision();
    record.backing = {content: "x"};
    qunit.equal("x", record.content());
});

qunit.test("test_approval_status", function() {
    qunit.expect(1);
    var record = new api.ActivityRevision();
    record.approval_status("x");
    qunit.equal("x", record.approval_status());
});

qunit.module("api/activity");

qunit.test("", function() {

});

qunit.test("", function() {

});

qunit.test("", function() {

});

qunit.test("", function() {

});

qunit.module("api/template");

qunit.module("api/subscriber");

qunit.module("api/list");
