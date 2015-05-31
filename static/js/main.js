$(document).ready(function(){
    var avatars = {
        'douglascalhoun': 'https://media.licdn.com/media/p/4/000/149/320/1c2f421.jpg',
        'mracus': 'https://media.licdn.com/media/p/8/005/05d/0b0/2645c4a.jpg',
        'shawndrost': 'https://pbs.twimg.com/profile_images/586651979348250624/3n3kd_5P.jpg',
    }

    // Needed to clear the intervals inside the closures 
    var checkTweetsInterval;

    function displayStream(stream) {
        clearInterval(checkTweetsInterval);
        // Clear previous tweets
        $('#tweets').html('');

        function displayNewTweets(stream, index) {    
            while(index <= stream.length -1){
                var tweet = stream[index];
                // Building elements
                var time = '<time class="timeago" datetime="' + tweet.created_at.toISOString() + '">' + tweet.created_at.toLocaleDateString() + '</time>';
                var image = avatars[tweet.user] ? avatars[tweet.user] : 'static/layout/avatar.png';
                var avatar = '<img class="avatar" src="' + image + '">'
                var user = '<span class="user">@' + tweet.user + '</span>';

                var message = tweet.message.replace(/(#\w+)/g,'<span class="tag">$1</span>');
                message = '<span class="message">' + message + '</span>';
                var $tweet = $('<div class="tweet" data-user="' + tweet.user + '"></div>').hide();
                $tweet.html(avatar + user + message + time);
                $tweet.prependTo($('#tweets'));
                $tweet.slideDown().fadeIn();
                index++;
                // Not sure how else to trigger this on nodes dynamically added to the DOM?
                $(".timeago").timeago();
            }
            return index;
        }
        // Loads the pregenerated posts
        var current_length = displayNewTweets(stream, 0);

        checkTweetsInterval = setInterval(function(){
            // If there are new tweets             
            if (stream.length > current_length) {
                current_length = displayNewTweets(stream, current_length);
            }
        }, 250);
    }

    // This refreshes what ever stream the user is on
    var breadcrumb = streams.home;
    $('nav').on('click', '.refresh', function() {
        displayStream(breadcrumb);
    });

    // Display the home stream on load
    displayStream(streams.home);

    // Displaying users tweets
    $('#tweets').on('click', '.tweet', function(){
        breadcrumb = streams.users[$(this).data('user')]
        displayStream(breadcrumb);
    });
    
    // Displaying all tweets
    $('nav').on('click', '.home', function(){
        breadcrumb = streams.home
        displayStream(breadcrumb);
    });

    // Posting a new twweet
    $('.post-tweet').on('click', 'button', function(event){
        var form = $(this).closest('form');
        // Defined globally in data_generator.js
        window.visitor = form.find('[name="username"]').val();
        if (!streams.users[visitor])
            streams.users[visitor] = [];
        var message = form.find('[name="message"]').val();
        writeTweet(message);                    

        // Prevent the HTML form from submitting
        event.preventDefault();
    });
});