using System;
using System.Linq;
using Rnx.Abstractions.Tasks;
using Rnx.Tasks.Core.FileSystem;
using static Rnx.Tasks.Core.Tasks;
<%= lessNamespace %><%= markdownNamespace %>
public class RnxTasks
{
	public ITaskDescriptor SayHello => Log(">>>> Hello Rnx! <<<<");
    
    public ITaskDescriptor PrintJsonFiles => Series(
        SayHello,
        ReadFiles("**/*.json"),
        LogElement(element => $"Found file: '{element.Get<ReadFileData>().Filename}'")
    );
    <%- lessExample %><%- markdownExample %>
}