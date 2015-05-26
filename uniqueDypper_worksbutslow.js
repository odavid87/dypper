var uniqueDypper = {
    players: [],
    playersMatrix: {},
    initialPlayersMatrix: {},
    playerDelimiter: ' - ',
    pairs: [],

    addPlayer: function(name)
    {
        this.players.push(name);
    },

    getPlayer: function(playerIndex)
    {
        if ("undefined" != typeof this.players[playerIndex]) {
            return this.players[playerIndex];
        } else {
            return "No Pair";
        }
    },

    getMaxRounds: function()
    {
        return this.players.length - 1;
    },

    generatePlayersMatrix: function()
    {
        if (this.players.length % 2 > 0) {
            this.addPlayer("Nobody");
        }
        for(var i = 0; i < this.players.length; i++) {
            var outerPlayer = this.getPlayer(i);
            this.playersMatrix[outerPlayer] = {};
            for(var j = 0; j < this.players.length; j++) {
                var innerPlayer = this.getPlayer(j);
                if (outerPlayer != innerPlayer) {
                    this.playersMatrix[outerPlayer][innerPlayer] = false;
                }
            }
        }
    },

    /**
     * Nagyon gány megoldás
     */
    generateAllPossiblePairs: function()
    {
        for (var round = 1; round <= this.getMaxRounds(); round++) {
            this.pairs[round] = [];
            try {
                for(var i = 0; i < this.players.length; i++) {
                    var player = this.getPlayer(i);
                    if (!this.hasPairForRound(player, round)) {
                        this.pairs[round].push(player + this.playerDelimiter + this.getRandomPair(player, round));
                    }
                }
            } catch (err) {
                round = 0;
                this.resetDypper();
            }
        }
    },

    getRandomPair: function(player, round)
    {
        var otherPlayers = Object.keys(this.playersMatrix[player]);
        for(var i = 0; i < 10; i++) {
            var possiblePair = otherPlayers[Math.floor(Math.random()*otherPlayers.length)];
            if (!this.playersMatrix[player][possiblePair]
                && !this.playersMatrix[possiblePair][player]
                && !this.hasPairForRound(possiblePair, round)
            ) {
                this.playersMatrix[player][possiblePair] = true;
                this.playersMatrix[possiblePair][player] = true;
                return possiblePair;
            }
        }
        throw "Cannot find pair for " + player + " in round #" + round;
    },


    hasPairForRound: function(player, round) {
        var counter = 0;
        for (var i in this.playersMatrix[player]) {
            if (this.playersMatrix[player][i]) {
                counter++;
            }
        }
        return counter >= round;
    },

    resetDypper: function()
    {
        this.pairs = [];
        for (var player in this.playersMatrix) {
            for (var otherPlayer in this.playersMatrix[player]) {
                this.playersMatrix[player][otherPlayer] = false;
            }
        }
    },
}