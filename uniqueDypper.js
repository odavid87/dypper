var uniqueDypper = {
    players: [],
    playersMatrix: {},
    initialPlayersMatrix: {},
    playerDelimiter: ' - ',
    pairs: [],
    maxRounds: null,

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
        if ("number" == typeof this.maxRounds) {
            return this.maxRounds < this.players.length - 1
                ? this.maxRounds
                : this.players.length - 1;
        }
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
        var rollbackCounter = 0;
        var iterationCounter = 0;
        for (var round = 1; round <= this.getMaxRounds(); round++) {
            iterationCounter++;
            //console.log("trying round #" + round);
            if (iterationCounter == 4000) {
                //console.log("breaking out");
                break;
            }
            this.pairs[round] = [];
            try {
                for(var i = 0; i < this.players.length; i++) {
                    var player = this.getPlayer(i);
                    if (!this.hasPairForRound(player, round)) {
                        this.pairs[round].push(
                            player
                            + this.playerDelimiter
                            + this.getRandomPair(player, round)
                        );
                    }
                }
            } catch (err) {
                this.rollbackRound(round);
                round--;
                rollbackCounter++;
                if (rollbackCounter == 1000 && round > 1) {
                    //console.log("double rollback");
                    this.rollbackRound(round);
                    round--;
                    rollbackCounter = 0;
                }
            }
        }
        //console.log("Iterations: " + iterationCounter);
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

    rollbackRound: function(round)
    {
        for (var i = 0; i < this.pairs[round].length; i++) {
            var players = this.pairs[round][i].split(this.playerDelimiter);
            this.playersMatrix[players[0]][players[1]] = false;
            this.playersMatrix[players[1]][players[0]] = false;
        }
        this.pairs[round] = [];
    },
}