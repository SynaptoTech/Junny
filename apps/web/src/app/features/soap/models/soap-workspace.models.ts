import type {
  KeyValueRow,
  RequestAuthConfig,
} from '../../requests/models/workspace.models';

export interface SoapTabState {
  id: string;
  title: string;
  url: string;
  xmlText: string;
  headerRows: KeyValueRow[];
  auth: RequestAuthConfig;
}
