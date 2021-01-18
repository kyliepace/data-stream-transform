import chai from 'chai';
import TransformService from '../../../src/consumer/services/TransformService';


describe('consumer > services > transformService', () => {
  let transformService = new TransformService();
  describe('#buildChildData', () => {
    describe('data without SESSION_START or SESSION_END events', () => {
      let childData;
      before(() => {
        const data = [
          {
            timestamp: 1569972083,
            type: 'EVENT',
            name: 'cart_loaded'
          }
        ];
        childData = transformService.buildChildData(data);
      });
      it('returns all the input data', () => {
        chai.expect(childData.length).to.equal(1);
      });
    });

    describe('data with SESSION_START event', () => {
      let childData;
      before(() => {
        const data = [
          {
            timestamp: 1569972083,
            type: 'SESSION_START',
            session_id: '12'
          },
          {
            timestamp: 1569972083,
            type: 'EVENT',
            name: 'cart_loaded'
          }
        ];
        childData = transformService.buildChildData(data, data[0].timestamp);
      });
      it('returns all the input data minus the first event', () => {
        chai.expect(childData.length).to.equal(1);
        chai.expect(childData[0].name).to.equal('cart_loaded');
      });
    });

    describe('data with SESSION_END event', () => {
      let childData;
      before(() => {
        const data = [
          {
            timestamp: 1569972083,
            type: 'EVENT',
            name: 'cart_loaded'
          },
          {
            timestamp: 1569972083,
            type: 'SESSION_END',
            session_id: '12'
          },
        ];
        childData = transformService.buildChildData(data, undefined, data[1].timestamp);
      });
      it('returns all the input data minus the last event', () => {
        chai.expect(childData.length).to.equal(1);
        chai.expect(childData[0].name).to.equal('cart_loaded');
      });
    });

    describe('data with SESSION_START and SESSION_END event', () => {
      let childData;
      before(() => {
        const data = [
          {
            timestamp: 1569972083,
            type: 'SESSION_START',
            session_id: '12'
          },
          {
            timestamp: 1569972083,
            type: 'EVENT',
            name: 'cart_loaded'
          },
          {
            timestamp: 1569972083,
            type: 'SESSION_END',
            session_id: '12'
          },
        ];
        childData = transformService.buildChildData(data, data[0].timestamp, data[2].timestamp);
      });
      it('returns all the input data minus the last event', () => {
        chai.expect(childData.length).to.equal(1);
        chai.expect(childData[0].name).to.equal('cart_loaded');
      });
    });
  });
});