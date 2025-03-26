import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { runCommand } from "./command.js";

// Create server instance
const server = new McpServer({
  name: "commandline",
  version: "1.0.0",
});

interface ExecResponse {
  stdout: string;
  stderr: string;
}

server.tool(
  "run-command",
  "Executes a shell command",
  {
    cmd: z.string().describe("The command to execute in the shell"),
  },
  async ({ cmd }) => {
    const response = await runCommand(cmd);
    return {
      content: [
        {
          type: "text",
          text: `stdout: \n${response.stdout}`,
        },
        {
          type: "text",
          text: `stderr: \n${response.stderr}`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // 将日志输出到标准错误，而不是标准输出
  console.error("Command Line MCP Server is running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
