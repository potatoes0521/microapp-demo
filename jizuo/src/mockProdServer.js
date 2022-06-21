/*
 * @LastEditors: 
 * @Description: mock server
 * @Date: 2022-03-15 10:37:27
 * @LastEditTime: 2022-03-15 15:56:31
 * @Author: 
 */
import { createProdMockServer } from '../../../es/createProdMockServer';
import testRoleMock from '../mock/testRole';
import testUserMock from '../mock/testUser';

export function setupProdMockServer() {
  createProdMockServer([...testRoleMock, ...testUserMock]);
}
