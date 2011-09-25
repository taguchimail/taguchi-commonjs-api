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
    qunit.equal(record.record_id(), "1");
});

qunit.test("test_ref", function() {
    qunit.expect(1);
    var record = new api.Campaign();
    record.ref("x");
    qunit.equal(record.ref(), "x");
});

qunit.test("test_name", function() {
    qunit.expect(1);
    var record = new api.Campaign();
    record.name("x");
    qunit.equal(record.name(), "x");
});

qunit.test("test_start_datetime", function() {
    qunit.expect(1);
    var record = new api.Campaign();
    record.start_datetime("x");
    qunit.equal(record.start_datetime(), "x");
});

qunit.test("test_xml_data", function() {
    qunit.expect(1);
    var record = new api.Campaign();
    record.xml_data("x");
    qunit.equal(record.xml_data(), "x");
});

qunit.test("test_status", function() {
    qunit.expect(1);
    var record = new api.Campaign();
    record.backing = {status: "x"};
    qunit.equal(record.status(), "x");
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
    qunit.equal(record.record_id(), "1");
});

qunit.test("test_content", function() {
    qunit.expect(1);
    var record = new api.ActivityRevision();
    record.backing = {content: "x"};
    qunit.equal(record.content(), "x");
});

qunit.test("test_approval_status", function() {
    qunit.expect(1);
    var record = new api.ActivityRevision();
    record.approval_status("x");
    qunit.equal(record.approval_status(), "x");
});

qunit.module("api/activity");

qunit.test("test_record_Id", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.backing = {id: 1};
    qunit.equal(record.record_id(), "1");
});

qunit.test("test_ref", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.ref("x");
    qunit.equal(record.ref(), "x");
});

qunit.test("test_name", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.name("x");
    qunit.equal(record.name(), "x");
});

qunit.test("test_type", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.type("x");
    qunit.equal(record.type(), "x");
});

qunit.test("test_subtype", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.subtype("x");
    qunit.equal(record.subtype(), "x");
});

qunit.test("test_target_lists", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.target_lists("x");
    qunit.equal(record.target_lists(), "x");
});

qunit.test("test_target_views", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.target_views("x");
    qunit.equal(record.target_views(), "x");

});

qunit.test("test_approval_status", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.approval_status("x");
    qunit.equal(record.approval_status(), "x");
});

qunit.test("test_deploy_datetime", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.deploy_datetime("x");
    qunit.equal(record.deploy_datetime(), "x");
});

qunit.test("test_template_id", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.template_id(1);
    qunit.equal(record.template_id(), "1");
});

qunit.test("test_campaign_id", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.campaign_id(1);
    qunit.equal(record.campaign_id(), "1");
});

qunit.test("test_throttle", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.throttle(1);
    qunit.equal(record.throttle(), 1);
});

qunit.test("test_xml_data", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.xml_data("x");
    qunit.equal(record.xml_data(), "x");
});

qunit.test("test_status", function() {
    qunit.expect(1);
    var record = new api.Activity();
    record.backing = {status: "x"};
    qunit.equal(record.status(), "x");
});

qunit.test("test_latest_revision", function() {
    qunit.expect(2);
    var record = new api.Activity();
    record.backing = {revisions: []};
    qunit.equal(record.latest_revision(), null);
    record.latest_revision(new api.ActivityRevision(record, {content: "x"}));
    var revision = record.latest_revision();
    qunit.equal(revision.content(), "x");
});

qunit.test("test_update", function() {

});

qunit.test("test_create", function() {

});

qunit.test("test_proof", function() {

});

qunit.test("test_request_approval", function() {

});

qunit.test("test_trigger", function() {

});

qunit.test("test_static_get", function() {

});

qunit.test("test_static_get_with_content", function() {

});

qunit.test("test_static_find", function() {

});

qunit.module("api/template_revision");

qunit.test("test_record_id", function() {
    qunit.expect(1);
    var record = new api.TemplateRevision();
    record.backing = {id: 1};
    qunit.equal(record.record_id(), "1");
});

qunit.test("test_format", function() {
    qunit.expect(1);
    var record = new api.TemplateRevision();
    record.format("x");
    qunit.equal(record.format(), "x");
});

qunit.test("test_content", function() {
    qunit.expect(1);
    var record = new api.TemplateRevision();
    record.content("x");
    qunit.equal(record.content(), "x");
});

qunit.module("api/template");

qunit.test("test_record_id", function() {
    qunit.expect(1);
    var record = new api.Template();
    record.backing = {id: 1};
    qunit.equal(record.record_id(), "1");
});

qunit.test("test_ref", function() {
    qunit.expect(1);
    var record = new api.Template();
    record.ref("x");
    qunit.equal(record.ref(), "x");
});

qunit.test("test_name", function() {
    qunit.expect(1);
    var record = new api.Template();
    record.name("x");
    qunit.equal(record.name(), "x");
});

qunit.test("test_type", function() {
    qunit.expect(1);
    var record = new api.Template();
    record.type("x");
    qunit.equal(record.type(), "x");
});

qunit.test("test_subtype", function() {
    qunit.expect(1);
    var record = new api.Template();
    record.subtype("x");
    qunit.equal(record.subtype(), "x");
});

qunit.test("test_xml_data", function() {
    qunit.expect(1);
    var record = new api.Template();
    record.xml_data("x");
    qunit.equal(record.xml_data(), "x");
});

qunit.test("test_status", function() {
    qunit.expect(1);
    var record = new api.Template();
    record.backing = {status: "x"};
    qunit.equal(record.status(), "x");
});

qunit.test("test_latest_revision", function() {
    qunit.expect(3);
    var record = new api.Template();
    record.backing = {revisions: []};
    qunit.equal(record.latest_revision(), null);
    record.latest_revision(new api.TemplateRevision(
        record, {content: "x", format: "y"}));
    var revision = record.latest_revision();
    console.log(typeof revision);
    qunit.equal(revision.content(), "x");
    qunit.equal(revision.format(), "y");
});

qunit.test("test_update", function() {

});

qunit.test("test_create", function() {

});

qunit.test("test_static_get", function() {

});

qunit.test("test_static_get_with_content", function() {

});

qunit.test("test_static_find", function() {

});

qunit.module("api/subscriber");

qunit.test("test_record_id", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.backing = {id: 1};
    qunit.equal(record.record_id(), "1");
});

qunit.test("test_ref", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.ref("x");
    qunit.equal(record.ref(), "x");
});

qunit.test("test_title", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.title("x");
    qunit.equal(record.title(), "x");
});

qunit.test("test_firstname", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.firstname("x");
    qunit.equal(record.firstname(), "x");
});

qunit.test("test_lastname", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.lastname("x");
    qunit.equal(record.lastname(), "x");
});

qunit.test("test_notifications", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.notifications("x");
    qunit.equal(record.notifications(), "x");
});

qunit.test("test_extra", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.extra("x");
    qunit.equal(record.extra(), "x");
});

qunit.test("test_phone", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.phone("x");
    qunit.equal(record.phone(), "x");
});

qunit.test("test_dob", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.dob("x");
    qunit.equal(record.dob(), "x");
});

qunit.test("test_address", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.address("x");
    qunit.equal(record.address(), "x");
});

qunit.test("test_address2", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.address2("x");
    qunit.equal(record.address2(), "x");
});

qunit.test("test_address3", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.address3("x");
    qunit.equal(record.address3(), "x");
});

qunit.test("test_suburb", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.suburb("x");
    qunit.equal(record.suburb(), "x");
});

qunit.test("test_state", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.state("x");
    qunit.equal(record.state(), "x");
});

qunit.test("test_country", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.country("x");
    qunit.equal(record.country(), "x");
});

qunit.test("test_postcode", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.postcode("x");
    qunit.equal(record.postcode(), "x");
});

qunit.test("test_gender", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.gender("x");
    qunit.equal(record.gender(), "x");
});

qunit.test("test_email", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.email("x");
    qunit.equal(record.email(), "x");
});

qunit.test("test_social_rating", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.backing = {social_rating: "x"};
    qunit.equal(record.social_rating(), "x");
});

qunit.test("test_social_profile", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.backing = {social_profile: "x"};
    qunit.equal(record.social_profile(), "x");
});

qunit.test("test_unsubscribe_datetime", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.unsubscribe_datetime("x");
    qunit.equal(record.unsubscribe_datetime(), "x");
});

qunit.test("test_bounce_datetime", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.bounce_datetime("x");
    qunit.equal(record.bounce_datetime(), "x");
});

qunit.test("test_xml_data", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.xml_data("x");
    qunit.equal(record.xml_data(), "x");
});

qunit.test("test_get_custom_field", function() {
    qunit.expect(2);
    var record = new api.Subscriber();
    record.backing = {custom_fields: [{field: "x", data: "x"}]};
    qunit.equal(record.get_custom_field("x"), "x");
    qunit.equal(record.get_custom_field("y"), null);
});

qunit.test("test_set_custom_field", function() {
    qunit.expect(1);
    var record = new api.Subscriber();
    record.backing = {custom_fields: [{field: "x", data: "x"}]};
    record.set_custom_field("x", "y");
    qunit.equal(record.get_custom_field("x"), "y");
});

qunit.test("test_is_subscribed_to_list", function() {
    qunit.expect(2);
    var record = new api.Subscriber();
    record.backing = {
        lists: [
            {list_id: 1, unsubscribed: null, option: "option"},
            {list_id: 3, unsubscribed: "u", option: "option"}
        ]
    };
    qunit.equal(record.is_subscribed_to_list("1"), true);
    qunit.equal(record.is_subscribed_to_list("2"), false);
});

qunit.test("test_get_subscription_option", function() {
    qunit.expect(2);
    var record = new api.Subscriber();
    record.backing = {
        lists: [
            {list_id: 1, unsubscribed: null, option: "option"},
            {list_id: 3, unsubscribed: "u", option: "option"}
        ]
    };
    qunit.equal(record.get_subscription_option("1"), "option");
    qunit.equal(record.get_subscription_option("2"), null);
});

qunit.test("test_is_unsubscribed_from_list", function() {
    qunit.expect(2);
    var record = new api.Subscriber();
    record.backing = {
        lists: [
            {list_id: 1, unsubscribed: null, option: "option"},
            {list_id: 3, unsubscribed: "u", option: "option"}
        ]
    };
    qunit.equal(record.is_unsubscribed_from_list("1"), false);
    qunit.equal(record.is_unsubscribed_from_list("3"), true);
});

qunit.test("test_get_subscribed_list_ids", function() {
    qunit.expect(2);
    var record = new api.Subscriber();
    record.backing = {
        lists: [
            {list_id: 1, unsubscribed: null, option: "option"},
            {list_id: 3, unsubscribed: "u", option: "option"}
        ]
    };
    qunit.equal(record.get_subscribed_list_ids().length, 1);
    qunit.equal(record.get_subscribed_list_ids()[0], "1");
});

qunit.test("test_get_subscribed_lists", function() {

});

qunit.test("test_get_unsubscribed_list_ids", function() {
    qunit.expect(2);
    var record = new api.Subscriber();
    record.backing = {
        lists: [
            {list_id: 1, unsubscribed: null, option: "option"},
            {list_id: 3, unsubscribed: "u", option: "option"}
        ]
    };
    qunit.equal(record.get_unsubscribed_list_ids().length, 1);
    qunit.equal(record.get_unsubscribed_list_ids()[0], "3");
});

qunit.test("test_get_unsubscribed_lists", function() {

});

qunit.test("test_subscribe_to_list", function() {
    qunit.expect(2);
    var record = new api.Subscriber();
    record.backing = {
        lists: [
            {list_id: 1, unsubscribed: null, option: "option"},
            {list_id: 3, unsubscribed: "u", option: "option"}
        ]
    };
    qunit.equal(record.is_subscribed_to_list("2"), false);
    record.subscribe_to_list("2", "option");
    qunit.equal(record.is_subscribed_to_list("2"), true);
});

qunit.test("test_unsubscribe_from_list", function() {
    qunit.expect(2);
    var record = new api.Subscriber();
    record.backing = {
        lists: [
            {list_id: 1, unsubscribed: null, option: "option"},
            {list_id: 3, unsubscribed: "u", option: "option"}
        ]
    };
    qunit.equal(record.is_unsubscribed_from_list("1"), false);
    record.unsubscribe_from_list("1");
    qunit.equal(record.is_unsubscribed_from_list("1"), true);
});

qunit.test("test_create_or_update", function() {

});

qunit.test("test_static_get", function() {

});

qunit.test("test_static_find", function() {

});

qunit.module("api/subscriber_list");

qunit.test("test_record_id", function() {
    qunit.expect(1);
    var record = new api.SubscriberList();
    record.backing = {id: 1};
    qunit.equal(record.record_id(), "1");
});

qunit.test("test_ref", function() {
    qunit.expect(1);
    var record = new api.SubscriberList();
    record.ref("x");
    qunit.equal(record.ref(), "x");
});

qunit.test("test_name", function() {
    qunit.expect(1);
    var record = new api.SubscriberList();
    record.name("x");
    qunit.equal(record.name(), "x");
});

qunit.test("test_type", function() {
    qunit.expect(1);
    var record = new api.SubscriberList();
    record.type("x");
    qunit.equal(record.type(), "x");
});

qunit.test("test_creation_datetime", function() {
    qunit.expect(1);
    var record = new api.SubscriberList();
    record.backing = {timestamp: "x"};
    qunit.equal(record.creation_datetime(), "x");
});

qunit.test("test_xml_data", function() {
    qunit.expect(1);
    var record = new api.SubscriberList();
    record.xml_data("x");
    qunit.equal(record.xml_data(), "x");
});

qunit.test("test_status", function() {
    qunit.expect(1);
    var record = new api.SubscriberList();
    record.backing = {status: "x"};
    qunit.equal(record.status(), "x");
});

qunit.test("test_subscribe_subscriber", function() {

});

qunit.test("test_unsubscribe_subscriber", function() {

});

qunit.test("test_get_subscribers", function() {

});

qunit.test("test_static_get", function() {

});

qunit.test("test_static_find", function() {

});
