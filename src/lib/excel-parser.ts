import * as XLSX from 'xlsx';

export interface ParsedExcelData {
  headers: string[];
  rows: Record<string, unknown>[];
  summary: string;
  fileName: string;
  sheetName: string;
  totalRows: number;
}

export async function parseExcelToJSON(file: File): Promise<ParsedExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: '', // Default value for empty cells
        });
        
        if (jsonData.length === 0) {
          reject(new Error('No data found in the file'));
          return;
        }
        
        // Extract headers from first object keys
        const headers = Object.keys(jsonData[0]);
        
        // Generate summary for LLM context
        const summary = generateSummary(headers, jsonData, file.name, sheetName);
        
        resolve({
          headers,
          rows: jsonData,
          summary,
          fileName: file.name,
          sheetName,
          totalRows: jsonData.length,
        });
      } catch (error) {
        reject(new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

function generateSummary(
  headers: string[],
  rows: Record<string, unknown>[],
  fileName: string,
  sheetName: string
): string {
  const lines: string[] = [
    `File: ${fileName}`,
    `Sheet: ${sheetName}`,
    `Total rows: ${rows.length}`,
    `Columns: ${headers.join(', ')}`,
    '',
    'Sample data (first 3 rows):',
  ];
  
  // Add sample rows
  rows.slice(0, 3).forEach((row, index) => {
    const rowStr = headers.map(h => `${h}: ${row[h]}`).join(', ');
    lines.push(`Row ${index + 1}: ${rowStr}`);
  });
  
  // Try to detect common food-related columns
  const lowerHeaders = headers.map(h => h.toLowerCase());
  const detectedColumns: string[] = [];
  
  if (lowerHeaders.some(h => h.includes('food') || h.includes('item') || h.includes('dish') || h.includes('meal'))) {
    detectedColumns.push('food items');
  }
  if (lowerHeaders.some(h => h.includes('mass') || h.includes('weight') || h.includes('kg') || h.includes('amount'))) {
    detectedColumns.push('weight/mass');
  }
  if (lowerHeaders.some(h => h.includes('date') || h.includes('time'))) {
    detectedColumns.push('dates');
  }
  if (lowerHeaders.some(h => h.includes('org') || h.includes('location') || h.includes('restaurant') || h.includes('source'))) {
    detectedColumns.push('organization/location');
  }
  
  if (detectedColumns.length > 0) {
    lines.push('');
    lines.push(`Detected data types: ${detectedColumns.join(', ')}`);
  }
  
  return lines.join('\n');
}

export function parseCSVToJSON(file: File): Promise<ParsedExcelData> {
  return parseExcelToJSON(file); // SheetJS handles CSV natively
}

export function parseJSONFile(file: File): Promise<ParsedExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const jsonData = JSON.parse(text);
        
        // Handle array of objects
        const rows = Array.isArray(jsonData) ? jsonData : [jsonData];
        
        if (rows.length === 0) {
          reject(new Error('No data found in JSON file'));
          return;
        }
        
        const headers = Object.keys(rows[0]);
        const summary = generateSummary(headers, rows, file.name, 'JSON');
        
        resolve({
          headers,
          rows,
          summary,
          fileName: file.name,
          sheetName: 'JSON',
          totalRows: rows.length,
        });
      } catch (error) {
        reject(new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

export async function parseFile(file: File): Promise<ParsedExcelData> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'xlsx':
    case 'xls':
    case 'csv':
      return parseExcelToJSON(file);
    case 'json':
      return parseJSONFile(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

