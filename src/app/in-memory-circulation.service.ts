import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ParsedRequestUrl, RequestInfo, RequestInfoUtilities, ResponseOptions } from 'angular-in-memory-web-api/interfaces';
import { getStatusText, STATUS } from 'angular-in-memory-web-api/http-status-codes';
import * as fixtures from './fixtures.json';

export class InMemCirculationService implements InMemoryDbService {

  get(reqInfo: RequestInfo) {
    if (reqInfo.id === 'requested') {
      const memberPids = reqInfo.query.get('member_pid');
      if (memberPids.length) {
        const memberPid = memberPids.pop();
        return reqInfo.utils.createResponse$(() => {
          const collection = reqInfo.collection;
          const dataEncapsulation = reqInfo.utils.getConfig().dataEncapsulation;
          const id = reqInfo.id;
          const data = collection.filter(
            item => {
              return item._circulation.status === 'on_shelf' && item.member_pid === memberPid && item._circulation.holdings.length > 0;
            }
          );
          // deepcopy
          const copy_data = [];
          for (const d of data) {
            copy_data.push(JSON.parse(JSON.stringify(d)));
          }
          const options: ResponseOptions = copy_data ?
          {
            body: dataEncapsulation ? { copy_data } : copy_data,
            status: STATUS.OK
          } :
          {
            body: { error: `Items not found` },
            status: STATUS.NOT_FOUND
          };
          return this.finishOptions(options, reqInfo);
        });
      }
    }
    const patronBarcodes = reqInfo.query.get('patron_barcode');
    if (patronBarcodes) {
      return reqInfo.utils.createResponse$(() => {
        const collection = reqInfo.collection;
        const dataEncapsulation = reqInfo.utils.getConfig().dataEncapsulation;
        const id = reqInfo.id;
        const data = collection.filter(
          item => {
            return item._circulation.holdings.findIndex(
              holding => {
                return holding.patron_barcode === patronBarcodes[0];
              }) > -1;
          }
          );
        const options: ResponseOptions = data ?
        {
          body: dataEncapsulation ? { data } : data,
          status: STATUS.OK
        } :
        {
          body: { error: `'Items' with id='${id}' not found` },
          status: STATUS.NOT_FOUND
        };
        return this.finishOptions(options, reqInfo);
      });
    }
    return undefined; // let the default GET handle all others
  }

  private finishOptions(options: ResponseOptions, {headers, url}: RequestInfo) {
    options.statusText = getStatusText(options.status);
    options.headers = headers;
    options.url = url;
    return options;
  }

  createDb() {
    return fixtures;
  }
}
