var dypper = {
	players: [],
	pairs: [],
	pairArchive:[],
	playerDelimiter: ' - ',

	addPlayer: function(name)
	{
		this.players.push(name);
	},

	dropPlayer: function(name)
	{
		var playerIndex = this.players.indexOf(name);
		if (playerIndex >= 0) {
			this.players.splice(playerIndex, 1);
		}
	},

	getRandomPairs: function()
	{
		this.shuffle(this.players);
        this.pairs = [];
		for (var i = 0; i < this.players.length; i++) {
			var pair = this.getPlayer(i) + this.playerDelimiter + this.getPlayer(i+1);
			i++;
			this.archivePair(pair);
			this.pairs.push(pair);
		}
	},

	getPlayer: function(playerIndex)
	{
		if ("undefined" != typeof this.players[playerIndex]) {
			return this.players[playerIndex];
		} else {
			return "No Pair";
		}
	},

	archivePair: function(pair)
	{
		var players = pair.split(this.playerDelimiter);
		players.sort();
		this.pairArchive.push(players.join(this.playerDelimiter));
	},

	shuffle: function(o)
	{
    	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    	return o;
	},

	deleteFromArray: function(value, arr)
	{
		var index = arr.indexOf(value);
		if (index == -1) return;
		arr.splice(index, 1);
	},
}