# game-tracker
project for tracking what games you are playing and when and creating your own profile site

## current ideas
* Long term - make this very customizable
* Have an overall user profile screen that serves as a overall profile view
	* Could show currently playing game
	* Show a list of top X most played games
	* Show a list of most recent played games
	* Show a github like graph showing little game icons representing what games were played over which days over the span of a few months
* Have a specific game profile screen that represents the play information for a specific user + game
	* Full log view of all play times that have happened over the lifetime of the application
	* report of how many times you played the game each year
	* report of how many times you played the game each month
	* report of how many times you played the game each week
	* report of how many times you played the game each day
	* graph of time spent in game each day
	* patient gamer? how long did you wait to play this game after release
* User Profile
	* allow theme plugins using jss
	* allow for custom jss for user
* Game Icons
	* Download them into folder to serve locally
	* Job to update icons on interval?
	* Give user ability to override icons used
	* Steam
		* Use steamcmd to batch fetch icons? Find another way to get icon property for steamid?
		* https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/[steamid]/[steam api -> icon].jpg
	* Origin
		* No clue what to do here, everything is manual since they have few games? Does this mean there needs to be an game-tracker repository of icons?
		* Maybe Origin has an API somewhere? Hah
	* UPlay
		* No research has been done here.
