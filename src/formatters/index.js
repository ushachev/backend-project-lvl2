import formatInPretty from './prettyFormatter';
import formatInPlain from './plainFormatter';

const formatInJson = (diff) => JSON.stringify(diff, null, 2);

export { formatInPretty, formatInPlain, formatInJson };
