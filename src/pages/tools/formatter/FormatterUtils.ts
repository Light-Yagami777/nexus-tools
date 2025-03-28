
type FileType = 'json' | 'html' | 'css' | 'javascript' | 'sql' | 'xml' | 'markdown' | 'text';

export const formatCodeByType = (input: string, fileType: FileType): string => {
  if (!input.trim()) {
    throw new Error(`Please enter ${fileType.toUpperCase()} data`);
  }

  let formatted = '';
  
  switch (fileType) {
    case 'json':
      const parsed = JSON.parse(input);
      formatted = JSON.stringify(parsed, null, 2);
      break;
    case 'html':
      formatted = input
        .replace(/>\s*</g, '>\n<')
        .replace(/(<[^>]+>)/g, (match) => {
          return match.replace(/\s+/g, ' ');
        })
        .split('\n')
        .map(line => line.trim())
        .join('\n');
      break;
    case 'css':
      formatted = input
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/\s*;\s*/g, ';\n  ')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/\n\s*\n/g, '\n');
      break;
    case 'javascript':
      try {
        const obj = eval('(' + input + ')');
        formatted = JSON.stringify(obj, null, 2);
      } catch (e) {
        formatted = input
          .replace(/\s*{\s*/g, ' {\n  ')
          .replace(/\s*;\s*/g, ';\n  ')
          .replace(/\s*}\s*/g, '\n}\n')
          .replace(/\n\s*\n/g, '\n');
      }
      break;
    case 'sql':
      formatted = input
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ', ')
        .replace(/\s*=\s*/g, ' = ')
        .replace(/\s*(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|OUTER JOIN|ON|AND|OR)\s*/gi, '\n$1 ')
        .trim();
      break;
    case 'xml':
      formatted = input
        .replace(/>\s*</g, '>\n<')
        .replace(/(<[^>]+>)/g, (match) => {
          return match.replace(/\s+/g, ' ');
        })
        .split('\n')
        .map(line => line.trim())
        .join('\n');
      break;
    case 'markdown':
      formatted = input
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s+\n/g, '\n')
        .trim();
      break;
    default:
      formatted = input
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s+\n/g, '\n')
        .trim();
  }

  return formatted;
};

export const minifyCodeByType = (input: string, fileType: FileType): string => {
  if (!input.trim()) {
    throw new Error(`Please enter ${fileType.toUpperCase()} data`);
  }
  
  let minified = '';
  
  switch (fileType) {
    case 'json':
      const parsed = JSON.parse(input);
      minified = JSON.stringify(parsed);
      break;
    case 'html':
      minified = input
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+>/g, '>')
        .replace(/<\s+/g, '<')
        .trim();
      break;
    case 'css':
      minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .trim();
      break;
    case 'javascript':
      minified = input
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .trim();
      break;
    case 'sql':
      minified = input
        .replace(/--.*$/gm, '')
        .replace(/\s+/g, ' ')
        .trim();
      break;
    case 'xml':
      minified = input
        .replace(/>\s+</g, '><')
        .replace(/\s+>/g, '>')
        .replace(/<\s+/g, '<')
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim();
      break;
    default:
      minified = input
        .replace(/\s+/g, ' ')
        .trim();
  }
  
  return minified;
};

export const detectFileType = (fileName: string): FileType => {
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (fileExtension === 'json') return 'json';
  if (fileExtension === 'html' || fileExtension === 'htm') return 'html';
  if (fileExtension === 'css') return 'css';
  if (fileExtension === 'js') return 'javascript';
  if (fileExtension === 'sql') return 'sql';
  if (fileExtension === 'xml') return 'xml';
  if (fileExtension === 'md' || fileExtension === 'markdown') return 'markdown';
  return 'text';
};
