Meteor.subscribe('playerNames');

if (Meteor.isClient){
Meteor.subscribe('userPosts');

Template.game.helpers({
    charsRemaining: function () {
        return Session.get('CharactersRemaining');
    },
    posts : function () {
        return Posts.find({}, {sort: {date: -1}});
    },
    timeDiff : function (postDate) {
        var timeDiff = new Date().getTime() - postDate.getTime();
        var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
        var diffHours = Math.floor(timeDiff  / (1000 * 3600));
        var diffMins = Math.floor(timeDiff  / (1000 * 60));
        var diffSecs = Math.floor(timeDiff  / (1000));

        if (diffDays > 0)
             return ("about " + diffDays + "d ago");
        else if(diffHours > 0)
            return ("about " + diffHours +"h ago");
        else if(diffMins > 0 )
            return ("about " + diffMins + "m ago");
        else if(diffSecs > 0)
             return ("about " + diffSecs + "s ago");
        },
        checked : function (users) {
        if($.inArray(Meteor.userId(), users) > -1)
            return true;
        else
            return false;
    },
    userCreated : function (createdBy){
        if(createdBy == Meteor.userId())
            return true;
        else
            return false;

    }
});
Template.game.onRendered(function () {
    $("#postForm").validate();
});
Template.game.events({
    'keyup #inputPost': function (event) {
        var inputText = event.target.value;
        Session.set("CharactersRemaining", (140 - inputText.length));

    },
    'submit #postForm' : function(event){
        event.preventDefault();
        var post = event.target.inputPost.value;
        event.target.reset();
        Session.set("CharactersRemaining", (140) + "  "+ " Charaters Remaining");
        Meteor.call('insertPost', post);
    },
    'click.likeBox' : function(event) {
        if (event.toElement.checked){
            Meteor.call('likePost', this._id);
        }
        else{
            Meteor.call('unlikePost', this._id);
        }
    }
    });
}
