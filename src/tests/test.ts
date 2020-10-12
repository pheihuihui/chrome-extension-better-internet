import assert from "assert";
import { _testPacTs } from "../pac_im";


describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            const val = _testPacTs()
            assert.strictEqual(val, 1);
        });
    });
});