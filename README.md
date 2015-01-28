# HSBC Statement to CSV bookmarklet

Got an HSBC account? Want to get the data into FreeAgent?

How about a bookmarklet that'll dig the data out of an online statement page and give it to you in a csv?

## Usage

Create a new bookmark in your browser and set the url to be:

```html
javascript:(function(){;function%20loadScript(url)%7Bvar%20d=document;d.body.appendChild(d.createElement(%22script%22)).src=url%7DloadScript(%22https://rawgit.com/olizilla/hsbc-statement-to-csv/master/dist/hsbc-statement-to-csv.min.js%22);})()
```

Log into your HBSC online banking account, open a previous statement, and click the bookmark.

**Hey Presto** a csv file with your payment info, in a freeagent friendly format.

## IS THIS SAFE?

**Totally** the code simply reads the html that's currently in your page, picks out the statement info,
and turns it into a csv, all in your browser, none of your data goes anywhere.

All the intersting code is in `hsbc-statement-to-csv.js`.

Due to size constraints on a bookmarklet, the code is loaded from github, via https://rawgit.com, but that's it.

Your data is yours, I don't want it. I can barely keep my own books up to date.

## Build

The code is bundled and minified by [bowserify](http://browserify.org/) and [uglify](https://github.com/mishoo/UglifyJS) and into the `dist` dir, with extra bookmarklet chops
added by [bookmarkletify](https://github.com/johnkpaul/bookmarkletify)

```sh
 npm run build
```

## Thanks

@dahousecat for the original inspiration - https://github.com/dahousecat/hsbc-statement-to-csv
@salfield for the freeagent friendly remake - https://github.com/salfield/hsbc-statement-to-csv
@johnkpaul for bookmarkletify - https://github.com/johnkpaul/bookmarkletify

I got carried away and re-wrote the code to be more CommonJS, functional and obvious for future maintainers.
Most notably, this version builds a model of the data first before building the csv. It uses this to more accurately
guess the year for a given payment. There is a significant bug in the other versions where statements that cross a year
boundary will have incorrect payment dates in the csv. This version fixes that.

O!
