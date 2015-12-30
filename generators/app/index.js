'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var cp = require('child_process');

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    //this.log(yosay('Welcome to the ' + chalk.red('Rnx') + ' generator!'));  
  },
  prompting: function () {
    var done = this.async();
    var prompts = [{
      type: 'checkbox',
      name: 'tasks',
      message: 'What other tasks do you need?',
      choices:[{
        name: 'Markdown',
        value: 'markdown',
        checked: false
        },{
        name: 'Less preprocessor',
        value: 'less',
        checked: false
      }]
    }];
        
    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function () {
    if(!this.fs.exists(this.destinationPath('project.json'))) {
        this.fs.copy(
            this.templatePath('project.json'),
            this.destinationPath('project.json')
        );
    }
    
    var tasks = this.props.tasks;
    function hasTask (t) {
        return tasks.indexOf(t) !== -1;
    }
    
    this.nugets = [];
    this.nugets.push("Rnx");
    
    if(hasTask("less")){
        this.nugets.push("Rnx.Tasks.Reliak.Less");
    }
    if(hasTask("markdown")){
        this.nugets.push("Rnx.Tasks.Reliak.Markdown");
    }
    
    if(!this.fs.exists(this.destinationPath('rnx.cs'))) {
        this.fs.copyTpl(
            this.templatePath('rnx.cs'),
            this.destinationPath('rnx.cs'), {
                lessNamespace: hasTask("less") ? "using static Rnx.Tasks.Reliak.Less.Tasks;\n" : "",
                lessExample: hasTask("less") ? this.fs.read(this.templatePath('lessExample.txt')) : "",
                markdownNamespace: hasTask("markdown") ? "using static Rnx.Tasks.Reliak.Markdown.Tasks;\n" : "",
                markdownExample: hasTask("markdown") ? this.fs.read(this.templatePath('markdownExample.txt')) : ""
            }
        );
    }
  },

  install: function () {
    this.log("Installing NuGet packages...");
    
    for(var pkg of this.nugets){
        this.log(chalk.magenta(pkg));
        this.log(cp.execSync("dnu install " + pkg + " --quiet").toString());
    }
    
    this.log('\nLaunching task ' + chalk.magenta('SayHello') + ' via "dnx rnx SayHello"...\n');
    this.spawnCommand('dnx', ['rnx', 'SayHello']);
  }
});