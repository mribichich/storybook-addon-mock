import addons, { makeDecorator } from '@storybook/addons';
import faker from './utils/faker';
import {
  ADDONS_MOCK_SEND_DATA,
  ADDONS_MOCK_SET_SKIP,
} from './utils/events';

export default makeDecorator({
  name: 'withMock',
  parameterName: 'mockData',
  // This means don't run this decorator if the notes decorator is not set
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, { parameters }) => {
    const channel = addons.getChannel();
    faker.makeInitialApis(parameters);

    // Our simple API above simply sets the notes parameter to a string,
    // which we send to the channel
    channel.emit(ADDONS_MOCK_SEND_DATA, faker.getApis());

    // we can also add subscriptions here using channel.on('eventName', callback);
    channel.on(ADDONS_MOCK_SET_SKIP, (item) => {
      faker.setSkip(item.url, item.method);
      channel.emit(ADDONS_MOCK_SEND_DATA, faker.getApis());
    });

    return getStory(context);
  },
});
