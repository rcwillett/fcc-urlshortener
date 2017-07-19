#Willitt's url shortening microservice

Welcome to my simplistic url shortening microservice. To use this service, simply append "/" and the url of the site you would like to have a shortened url for. (e.g. https://fccurlshortenerservice.glitch.me/https://www.facebook.com) This will return a json object of the following form:

'''{"originalUrl" : "(Your Valid Url)", "shortenedUrl" : "(Shortened Version of Valid Url)"}'''

Should you navigate to the shortened url you will be redirected to the original url.

##Limitations:
Note that for the purposes of this task the urls that are considered valid for this service are those that follow a structure of Protocol:Domain. No ip addresses or other unusual urls will be accepted by the application