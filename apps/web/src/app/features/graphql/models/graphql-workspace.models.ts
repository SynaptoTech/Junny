import type {
  KeyValueRow,
  RequestAuthConfig,
} from '../../requests/models/workspace.models';

export interface GraphqlTabState {
  id: string;
  title: string;
  url: string;
  queryText: string;
  variablesText: string;
  headerRows: KeyValueRow[];
  auth: RequestAuthConfig;
}
