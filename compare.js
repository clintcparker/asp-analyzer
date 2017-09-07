const fs = require('fs');
const json2csv = require('json2csv');

var compareModule = function(moduleOpts) {
    var fields = ["file", "num_refs_before", "num_refs_after", "includes_before", "includes_after", "total_loc_before", "total_loc_after", "loc_delta"];
    var comparison = [];

    function findFileByName(arr, filename) {
        return arr.find(function(element) {
            return element.file === filename;
        });
    }

    function statsEqual(combined) {
        return (combined[fields[1]] == combined[fields[2]]) && (combined[fields[3]] == combined[fields[4]]) && (combined[fields[5]] == combined[fields[6]]);
    }

    // These are the fields from the analyze process in analyze.js
    // fields = ["file", "num_refs", "num_includes", "loc", "total_loc"];

    function combineStats(beforeFile, afterFile) {
        var combined = {};
        combined[fields[0]] = afterFile.file;
        combined[fields[1]] = beforeFile.num_refs;
        combined[fields[2]] = afterFile.num_refs;
        combined[fields[3]] = beforeFile.num_includes;
        combined[fields[4]] = afterFile.num_includes;
        combined[fields[5]] = beforeFile.total_loc;
        combined[fields[6]] = afterFile.total_loc;
        combined[fields[7]] = beforeFile.total_loc - afterFile.total_loc;
        
        return combined;
    }

    function run(opts) {
        var before = opts.before;
        var after = opts.after;
        var comparisonFilename = opts.outFile;

        var diffFiles = 0;
        var stats = [];

        for (var i = 0; i < after.length; i++) {
            var afterFile = after[i];
            var beforeFile = findFileByName(before, afterFile.file);
            var combined = combineStats(beforeFile, afterFile);
            if (!statsEqual(combined)) {
                diffFiles++;
                stats.push(combined);
            }
        }

        console.log(diffFiles + " files changed");

        var csv = json2csv({data: stats, fields: fields});
        fs.writeFileSync(comparisonFilename, csv);
        console.log(comparisonFilename + " saved.");
    }
    return {
        run: run
    }
}

module.exports = compareModule;