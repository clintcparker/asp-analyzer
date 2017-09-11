const minOpts = require("minimist-options");
const parseArgs = require("minimist");
const nodeOs = require("os");
const nodePath = require("path");
const defaultOutput = "Desktop/asp-analyze";
const commanderModule = require("commander");


function getOpts(){
    

    const argOpts =  minOpts({
        path:{
            type:"string",
            alias:["directory","dir","d"],
            default:"."
        },
        analysisName:{
            type:"string",
            alias:["n"],
            default:"ASP-Analysis"
        },
        output:{
            type:"string",
            alias:["o"],
            default:defaultOutput
        },
        before:{
            type:"string"
        },
        after:{
            type:"string"
        },
        summary:{
            type:"boolean",
            alias:["s"],
            default:true
        }
    });



    /*  command line arg options
        opts.string - a string or array of strings argument names to always treat as strings
        opts.boolean - a boolean, string or array of strings to always treat as booleans. if true will treat all double hyphenated arguments without equal signs as boolean (e.g. affects --foo, not -f or --foo=bar)
        opts.alias - an object mapping string names to strings or arrays of string argument names to use as aliases
        opts.default - an object mapping string argument names to default values
        opts.stopEarly - when true, populate argv._ with everything after the first non-option
        opts['--'] - when true, populate argv._ with everything before the -- and argv['--'] with everything after the --. Here's an example:
        opts.unknown - a function which is invoked with a command line parameter not defined in the opts configuration object. If the function returns false, the unknown option is not added to argv.
    */

    var argArray = process.argv;
    return buildOpts(argArray,argOpts);
}


function getDateTimeForPath() {
    var now = new Date();
    
    return now.getFullYear() + "" + (now.getMonth() + 1) + "" + now.getDate() + "-" + now.getHours() + "" + now.getMinutes() + "" + now.getSeconds();
}

function buildOpts(argv, argOpts){
    
    var args = commanderModule
    .version("1.0.0")
    .option("--path,-p,--dir,-d,--directory", "--dir <path>")
    .option("--analysisName, -n", "--analysisName [name]")
    .option("--before, -b","--before ")
    
    
    
    var pathArg = args.path;
    if (!pathArg) {
        console.error("--path is required");
        return;
    }
    
    var beforeArg = args.before;
    var afterArg = args.after;
    var hasBeforeAndAfterArgs = false;
    
    
            
    // These are git references (branch or SHA)
    if ((!afterArg && !!beforeArg) || (!!afterArg && !beforeArg)) {
        console.error("Must pass --before and --after");
        return;
    } else {
        if (beforeArg && afterArg){
            hasBeforeAndAfterArgs = true;        
        }
    }
    
    var analysisNameArg = args.analysisName;
    if (!analysisNameArg && !hasBeforeAndAfterArgs) {
        console.error("--analysisName is required");
        return;
    }
    
    
    var outputArg = args.output;
    if (outputArg == defaultOutput){
        outputArg = nodePath.join(nodeOs.homedir(),outputArg);
    }
    
    
    var outputDir = nodePath.join(outputArg, getDateTimeForPath());
    
    
    var outputOpts = {
        dir:pathArg,
        analysisName:analysisNameArg,
        before:beforeArg,
        after:afterArg,
        compare:hasBeforeAndAfterArgs,
        output:outputDir,
        summary:args.summary
    };
    
    
    
    
        
    
    
        //console.log(outputOpts)
    return outputOpts;
}


module.exports = {
    getOpts : getOpts,
    buildOpts : buildOpts
};