import { NextRequest, NextResponse } from 'next/server';
import { fetchReports } from '@/lib/api';
import { getLocalArticles } from '@/lib/local-content';

// Standard MCP Protocol Tools Definition
const MCP_TOOLS = [
  {
    name: 'search_ai_reports',
    description:
      'Search curated global AI intelligence reports, research papers, and industry analyses from Ayato Studio.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keyword or topic to search for in AI reports (e.g., "DeepSeek", "MCP", "agents")',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of reports to return (default: 5, max: 20)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_product_catalog',
    description:
      'Retrieve official product specifications, architecture, pricing, and distribution links for Ayato Studio software (Transform_MovieToText, ProjectCodeMap, Ripen, LogicHive).',
    inputSchema: {
      type: 'object',
      properties: {
        product: {
          type: 'string',
          description: 'Product name or slug (optional: "movie-to-text", "project-code-map", "all")',
        },
      },
    },
  },
  {
    name: 'get_technical_insights',
    description:
      'Fetch in-depth technical engineering insights on local AI, air-gapped architectures, AST context compression, and agent memory from Ayato Studio.',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Specific topic or slug (e.g., "air-gapped", "ast", "all")',
        },
      },
    },
  },
];

// Product Data Store
const PRODUCTS_DATA = [
  {
    name: 'Transform_MovieToText',
    slug: 'movie-to-text',
    url: 'https://ayato-studio.ai/services/movie-to-text',
    category: 'AI Transcription & Local Security',
    headline: '100% Offline, Air-gapped AI Meeting Transcription for Windows',
    architecture:
      'Faster-Whisper STT + ONNX CAM++ Speaker Diarization + Non-Embedding SQLite FTS5 RAG. 0 bytes external data transmission.',
    pricing: {
      community: 'Free & Open Source (manual build)',
      pro_monthly: '1,480 JPY / month (Priority model updates & automated installers)',
      lifetime: '9,800 JPY (One-time payment)',
    },
  },
  {
    name: 'ProjectCodeMap',
    slug: 'project-code-map',
    url: 'https://ayato-studio.ai/services/project-code-map',
    category: 'AI-Driven Development (AIDD) Context Optimization',
    headline: 'AST-Based Codebase Context Compressor for Cursor & Claude',
    architecture:
      'Tree-sitter multi-language AST parser. Compresses codebase context by up to 85% into clean XML signatures.',
    cli_usage: 'uvx project-code-map --format xml > context.xml',
    pricing: {
      cli: 'Free & Open Source',
      pro_web: '980 JPY / month',
    },
  },
  {
    name: 'TenKOrbit',
    slug: 'tenk-orbit',
    url: 'https://ayato-studio.ai/services/tenk-orbit',
    category: 'Productivity & 10,000-Hour Rule AI Coaching',
    headline: '10,000-Hour Rule Progress Tracker & Local AI Handwriting Coaching for Windows/Mac/Android',
    architecture:
      'Seconds-precise calculation + Handwriting OCR + Dual-axis Local AI Rubric Evaluation. 100% private SQLite storage.',
    pricing: {
      community: 'Free & Open Source',
      pro_monthly: '980 JPY / month',
      lifetime: '4,980 JPY (One-time payment)',
    },
  },
  {
    name: 'Ripen MCP',
    slug: 'ripen',
    url: 'https://ayato-studio.ai/services/ripen',
    category: 'AI Agent Memory Infrastructure',
    headline: 'Episodic Long-Term Memory & Knowledge Graph Server for MCP',
    architecture: 'Model Context Protocol server for persistent agent context.',
  },
  {
    name: 'LogicHive MCP',
    slug: 'logichive',
    url: 'https://ayato-studio.ai/services/logichive',
    category: 'Code Search & Reuse Engine',
    headline: 'High-Precision Code Asset Indexer for Coding Assistants',
    architecture: 'Model Context Protocol server for modular snippet retrieval.',
  },
];

// Handle JSON-RPC 2.0 requests
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method, params } = body;

    // Validate JSON-RPC version
    if (jsonrpc !== '2.0') {
      return NextResponse.json(
        { jsonrpc: '2.0', id: id ?? null, error: { code: -32600, message: 'Invalid Request: jsonrpc must be "2.0"' } },
        { status: 400 }
      );
    }

    // 1. Initialize Handshake
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: { listChanged: false },
            resources: { listChanged: false },
            prompts: { listChanged: false },
          },
          serverInfo: {
            name: 'ayato-studio-web-mcp',
            version: '1.0.0',
          },
        },
      });
    }

    // 2. List Tools
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          tools: MCP_TOOLS,
        },
      });
    }

    // 3. Call Tool
    if (method === 'tools/call') {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};

      // Tool: search_ai_reports
      if (toolName === 'search_ai_reports') {
        const query = String(toolArgs.query || '').toLowerCase();
        const limit = Math.min(Number(toolArgs.limit) || 5, 20);

        const reports = await fetchReports();
        const filtered = reports
          .filter(
            (r) =>
              r.title.toLowerCase().includes(query) ||
              r.content.toLowerCase().includes(query) ||
              r.category.toLowerCase().includes(query)
          )
          .slice(0, limit)
          .map((r) => ({
            id: r.id,
            title: r.title,
            category: r.category,
            date: r.timestamp,
            summary: r.content.substring(0, 200) + '...',
            url: `https://ayato-studio.ai/reports/${r.slug}`,
          }));

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    query,
                    total_found: filtered.length,
                    reports: filtered,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        });
      }

      // Tool: get_product_catalog
      if (toolName === 'get_product_catalog') {
        const requestedProduct = String(toolArgs.product || 'all').toLowerCase();
        const result =
          requestedProduct === 'all'
            ? PRODUCTS_DATA
            : PRODUCTS_DATA.filter((p) => p.slug.includes(requestedProduct) || p.name.toLowerCase().includes(requestedProduct));

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
          },
        });
      }

      // Tool: get_technical_insights
      if (toolName === 'get_technical_insights') {
        const articles = getLocalArticles('insights');
        const formatted = articles.map((a) => ({
          title: a.title,
          slug: a.slug,
          date: a.date,
          category: a.category,
          description: a.description,
          url: `https://ayato-studio.ai/insights/${a.slug}`,
        }));

        return NextResponse.json({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(formatted, null, 2),
              },
            ],
          },
        });
      }

      // Unknown Tool
      return NextResponse.json(
        { jsonrpc: '2.0', id, error: { code: -32601, message: `Tool not found: ${toolName}` } },
        { status: 404 }
      );
    }

    // 4. List Prompts
    if (method === 'prompts/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          prompts: [
            {
              name: 'optimize_codebase_context',
              description: 'Generate an optimal AST context XML command for Cursor/Claude coding.',
            },
          ],
        },
      });
    }

    // 5. List Resources
    if (method === 'resources/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          resources: [
            {
              uri: 'ayato-studio://docs/llms.txt',
              name: 'Ayato Studio LLM Manifest',
              mimeType: 'text/plain',
            },
          ],
        },
      });
    }

    // Unknown Method
    return NextResponse.json(
      { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32603, message: `Internal error: ${error.message}` } },
      { status: 500 }
    );
  }
}

// Support GET for discoverability / health check
export async function GET() {
  return NextResponse.json({
    name: 'Ayato Studio Web MCP Server',
    status: 'online',
    protocol: 'Model Context Protocol (JSON-RPC 2.0)',
    version: '1.0.0',
    endpoint: 'https://ayato-studio.ai/api/mcp',
    available_tools: MCP_TOOLS.map((t) => t.name),
    usage: {
      post: 'Send JSON-RPC 2.0 requests to this endpoint (methods: initialize, tools/list, tools/call)',
      sample_payload: {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
      },
    },
  });
}
