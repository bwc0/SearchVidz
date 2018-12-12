document.getElementById("search-form").addEventListener("submit", (event) => {
    search();
    event.preventDefault();
});

$(function() {
    var searchField = $("#query");
    var icon = $("#search-button");

    //focus

    $(searchField).on('focus', function () {
        $(this).animate({
            width: "100%"
        }, 400);

        $(icon).animate({
            right: '10px'
        }, 400);
    });

    //blur
    $(searchField).on('blur', function () {
        if(searchField.val() == '') {
            $(searchField).animate({
                width: '45%'
            }, 400, function(){});

            $(icon).animate({
                right: '360px'
            }, 400, function () { });
        }
    });
});

function search() {
    // Clear
    var results = $('#results');
    var buttons = $('#buttons');

    results.html('');
    buttons.html('');

    // Get Input
    q = $('#query').val();

    // Run GET request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            type: 'video',
            key: 'AIzaSyDdLDVS83XrAeMVK2-q3nN8zu8H3Y7z1wE'
        }, function(data) {
            var nextPageToken = data.nextPageToken;
            var previousPageToken = data.prevPageToken;

            $.each(data.items, function(i, item) {
                var output = getOutput(item);

                //Display results
                $(results).append(output);
            });

            var pageButtons = getPageButtons(previousPageToken, nextPageToken);

            //Display button

            $(buttons).append(pageButtons);
        }
    )
}

function nextPageFunction () {

    // Clear
    var results = $('#results');
    var buttons = $('#buttons');
    var token = $('#next-button').data('token');
    var q = $('#next-button').data('query')

    results.html('');
    buttons.html('');

    // Get Input
    q = $('#query').val();

    // Run GET request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: 'AIzaSyDdLDVS83XrAeMVK2-q3nN8zu8H3Y7z1wE'
        }, function (data) {
            var nextPageToken = data.nextPageToken;
            var previousPageToken = data.prevPageToken;

            console.log(data);

            $.each(data.items, function (i, item) {
                var output = getOutput(item);

                //Display results
                $(results).append(output);
            });

            var pageButtons = getPageButtons(previousPageToken, nextPageToken);

            //Display button

            $(buttons).append(pageButtons);
        }
    )

}

function prevPageFunction() {

    // Clear
    var results = $('#results');
    var buttons = $('#buttons');
    var token = $('#prev-button').data('token');
    var q = $('#prev-button').data('query')

    results.html('');
    buttons.html('');

    // Get Input
    q = $('#query').val();

    // Run GET request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: 'AIzaSyDdLDVS83XrAeMVK2-q3nN8zu8H3Y7z1wE'
        },
        function (data) {
            var nextPageToken = data.nextPageToken;
            var previousPageToken = data.prevPageToken;

            console.log(data);

            $.each(data.items, function (i, item) {
                var output = getOutput(item);

                //Display results
                $(results).append(output);
            });

            var pageButtons = getPageButtons(previousPageToken, nextPageToken);

            //Display button

            $(buttons).append(pageButtons);
        }
    )

}

//Build output

function getOutput(item) {

    var videoId = item.id.videoId;
    var title = item.snippet.title;
    var date = item.snippet.publishedAt; 
    var description = item.snippet.description; 
    var thumb = item.snippet.thumbnails.high.url; 
    var channelTitle = item.snippet.channelTitle;

    //build output string

    return `
        <li>
            <div class="list-left">
                <img src="${thumb}">
            </div>
            
            <div class="list-right">
                <h3><a data-fancybox data-type="iframe" 
                data-src="http://youtube.com/embed/${videoId}" 
                href="javascript:;">${title}</a></h3>
                <small> By: <span class="cTitle">${channelTitle}</span>
                on ${date}
                </small>

                <p>${description}</p>
            </div>
        </li> 
        <div class="clearfix"><div>
        `
}

function getPageButtons(previousPageToken, nextPageToken) {

    if(!previousPageToken) {
        return `
        <div class="button-container">
            <button id="next-button" class="paging-button"
                data-token="${nextPageToken}" data-query="${q}"
                onclick="nextPageFunction();">Next Page</button>
        </div>
        `
    } else {

        return `
        <div class="button-container">
            
            <button id="prev-button"
                class="paging-button"
                data-token="${previousPageToken}"
                data-query = "${q}"
                onclick="prevPageFunction();">
                Previous Page
            </button>


            <button id="next-button"
                class="paging-button"
                data-token="${nextPageToken}" 
                data-query="${q}"
                onclick="nextPageFunction();">
                Next Page
            </button>

        </div>
        `
    }
}