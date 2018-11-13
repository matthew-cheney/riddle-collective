var firstApp = angular.module('potterApp', []);
firstApp.controller('PotterController', function($scope, $interval) {

    $scope.username;
    $scope.userURL;
    $scope.propertyName = '-DateCreated';
    $scope.quantity = 5;

    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            if ($scope.quantity < $scope.comments.length) {
                $scope.quantity++;
                $scope.comments = $scope.comments;
            }
        }
    });


    $.getJSON('comment', function(data) {
        $scope.comments = data;
        console.log("scope.comments = ", $scope.comments);
        //printComments(data);
    });


    $scope.getAllComments = function() {
        console.log("in getAllComments function");
        $.getJSON('comment', function(data) {
            $scope.comments = data;
            console.log("scope.comments = ", $scope.comments);
            //printComments(data);
        });
    }
    $scope.deletePost = function(postNum) {
        console.log(postNum);
        $.ajax({
            url: 'deletecomment',
            type: "DELETE",
            data: { "postID": postNum },
            success: function() {
                $scope.getAllComments();
                console.log("success");
            }
        });
    }

    $scope.addLikes = function(postNum) {
        console.log("adding like to ", postNum);
        $.ajax({
            url: 'addlikes',
            type: "POST",
            data: { "postID": postNum },
            success: function() {
                console.log("success");
                $scope.comments.find(x => x._id === postNum).Likes++;
            }
        })
    }

    $scope.init = function() {
        console.log("in init()");
        $scope.getAllComments();
        $scope.getAllComments();
        $scope.getAllComments();
    }

    /*function printComments(data) {
        console.log(data);
        var everything = "<ul id=\"commentsList\">";
        for (var comment = data.length - 1; comment >= 0; comment--) {
            var com = data[comment];
            everything += "<li><table><tr><td class=\"imgTD\"><img src=\"" + com.URL + "\" class=\"commentImg\"></td><td class=\"commentTD\"><span class=\"nameSays\">" + com.Name + " says...</span><br>" + com.Comment + "<button class=\"deleteMe\" onclick=\"deletePost(q5be5faa5db92f002a5326c36)\">Delete</button>" + com._id + "</td></tr></table></li>";
            //        everything += "<li> Name: " + com.Name + " -- Comment: " + com.Comment + "</li>";
        }
        everything += "</ul>";
        $("#comments").html(everything);
        console.log("worked");
    }*/



    /*    var count = 0;
        var auto = $interval(function() {
            $scope.getAllComments();
            count++;
        }, 10000);
        */

    function newPageLoad() {
        console.log("in newPageLoad function");
    }



    $("#potter").click(function() {
        $scope.username = "Harry Potter";
        $scope.userURL = "images/potter.png";
        $("#introPage").css({ 'display': 'none' });
        $("#tweetboard").css({ 'display': 'block' });
        newPageLoad();
    });
    $("#weasley").click(function() {
        $scope.username = "Ron Weasley";
        $scope.userURL = "images/weasley.png";
        $("#introPage").css({ 'display': 'none' });
        $("#tweetboard").css({ 'display': 'block' });
        newPageLoad();
    });
    $("#granger").click(function() {
        $scope.username = "Hermione Granger";
        $scope.userURL = "images/granger.png";
        $("#introPage").css({ 'display': 'none' });
        $("#tweetboard").css({ 'display': 'block' });
        newPageLoad();
    });
    $("#dumbledore").click(function() {
        $scope.username = "Albus Dumbledore";
        $scope.userURL = "images/dumbledore.png";
        $("#introPage").css({ 'display': 'none' });
        $("#tweetboard").css({ 'display': 'block' });
        newPageLoad();
    });
    $("#voldemort").click(function() {
        $scope.username = "Lord Voldemort";
        $scope.userURL = "images/voldemort.png";
        $("#introPage").css({ 'display': 'none' });
        $("#tweetboard").css({ 'display': 'block' });
        newPageLoad();
    });
    $("#hagrid").click(function() {
        $scope.username = "Rubeus Hagrid";
        $scope.userURL = "images/hagrid.png";
        $("#introPage").css({ 'display': 'none' });
        $("#tweetboard").css({ 'display': 'block' });
        newPageLoad();
    });
    $("#snape").click(function() {
        $scope.username = "Severus Snape";
        $scope.userURL = "images/snape.png";
        $("#introPage").css({ 'display': 'none' });
        $("#tweetboard").css({ 'display': 'block' });
        newPageLoad();
    });
    $("#malfoy").click(function() {
        $scope.username = "Draco Malfoy";
        $scope.userURL = "images/malfoy.png";
        $("#introPage").css({ 'display': 'none' });
        $("#tweetboard").css({ 'display': 'block' });
        newPageLoad();
    });

    $("#customSubmit").click(function() {
        $scope.username = $("#userName").val();
        $scope.userURL = $("#userURL").val();
        $("#userName").val('');
        $("#userURL").val('');
        $("#introPage").css({ 'display': 'none' });
        $("#tweetboard").css({ 'display': 'block' });
        newPageLoad();
    });

    $("#backToUsers").click(function() {
        $("#tweetboard").css({ 'display': 'none' });
        $("#introPage").css({ 'display': 'block' })
    })






    $scope.sortByNew = function() {
        $scope.propertyName = '-DateCreated';
    };

    $scope.sortByLikes = function() {
        $scope.propertyName = '-Likes';
    }

    $("#postComment").click(function() {
        var d = new Date();
        var myobj = { Name: $scope.username, Comment: $("#comment").val(), URL: $scope.userURL, Likes: 0, DateCreated: d.getTime() };
        $("#comment").val('');
        var jobj = JSON.stringify(myobj);
        //$("#json").text(jobj);
        var url = "comment";
        $.ajax({
            url: url,
            type: "POST",
            data: jobj,
            contentType: "application/json; charset=utf-8",
            success: function(data, textStatus) {
                console.log("successfully posted comment");
                $scope.getAllComments();
                //$("#done").html(textStatus);
            }
        });
    });

    $("#searchComments").click(function() {
        console.log("clicked search button");
        var url = "search?q=" + $("#search").val();
        console.log(url);
        $.getJSON(url, function(data) {
            console.log(data);
            //printComments(data);
        });
    });

});
