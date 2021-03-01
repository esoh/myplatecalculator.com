/**
 * e.g. node deploy.js --aws-profile fitzpo-dev --stage dev
 * uses SSM_WEB_HOST_BUCKET_PATH to get bucket name, and uploads build folder
 * there
 * uses SSM_WEB_CF_ID to create an invalidation
 *
 * Need to have aws cli installed, as aws cli command is executed
 * Must be run from root of repo, not in the scripts dir
 */
const AWS = require('aws-sdk');
const { argv } = require('yargs');
const spawn = require('child_process').spawn;

const opts = {
  stage: argv.stage || 'dev',
  region: argv.region || 'us-east-1',
  profile: argv['aws-profile'] || 'sean',
};
const SSM_WEB_HOST_BUCKET_PATH = `/mattgarywarmups/${opts.stage}/web/HOST_BUCKET`;
const SSM_WEB_CF_ID = `/mattgarywarmups/${opts.stage}/web/CF_ID`;

const credentials = new AWS.SharedIniFileCredentials({ profile: opts.profile });
AWS.config.credentials = credentials;
AWS.config.update({ region: opts.region });
const ssm = new AWS.SSM();
const sts = new AWS.STS();

const getSSM = async ssmName => {
  try {
    const resp = await ssm.getParameter({
      Name: ssmName,
      WithDecryption: true,
    }).promise();
    return resp.Parameter.Value;
  } catch (err) {
    if (err.code === 'ParameterNotFound') {
      console.log(`SSM param not found: ${SSM_WEB_HOST_BUCKET_PATH}`);
    }
    throw err;
  }
};

async function main() {

  const result = await sts.getCallerIdentity().promise();
  console.log(`AWS Account ID: ${result.Account}`);

  const webHostS3Bucket = await getSSM(SSM_WEB_HOST_BUCKET_PATH);
  console.log(`Web host bucket name: ${webHostS3Bucket}`);

  // sdk doesn't support s3 sync, also it's way more code to do it
  // so let's just execute the command
  const cmd = 'aws';
  const args = [
    's3', 'sync',
    'build/',
    `s3://${webHostS3Bucket}`,
    '--delete',
    '--profile', opts.profile,
  ];
  await new Promise(resolve => {
    console.log(`Running command:\n${cmd} ${args.join(' ')}\n`);
    const upload = spawn(cmd, args);
    upload.stdout.on('data', data => console.log(data.toString()));
    upload.stderr.on('data', data => console.error(data.toString()));
    upload.on('exit', code => {
      process.exitCode = code;
      resolve();
    });
  });

  // create cache invalidation
  const cloudfront = new AWS.CloudFront();
  const cfId = await getSSM(SSM_WEB_CF_ID);
  console.log(`Creating invalidation for cf with id: ${cfId}`);
  var params = {
    DistributionId: cfId, /* required */
    InvalidationBatch: { /* required */
      CallerReference: Date.now().toString(), /* required */
      Paths: { /* required */
        Quantity: 1, /* required */
        Items: ['/index.html']
      }
    }
  };
  await cloudfront.createInvalidation(params).promise();
  console.log('Invalidation created');
}
main();
