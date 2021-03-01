// learn more about HTTP functions here: https://arc.codes/primitives/http


const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'})

const ddb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('https://dynamodb.us-east-1.amazonaws.com') }) 
const ddbGeo = require('dynamodb-geo')
const { resolve } = require('path')

const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'wetap-fountains')
// Pick a hashKeyLength appropriate to your usage
config.hashKeyLength = 5

const myGeoTableManager = new ddbGeo.GeoDataManager(config)

exports.handler = async function http (req) {
  let json = await myGeoTableManager.queryRadius({
    RadiusInMeter: 10000,
    CenterPoint: {
      latitude: parseFloat(req.queryStringParameters.lat),
      longitude: parseFloat(req.queryStringParameters.lon)
    }
  })
  .then((data) => {
    return data;
  });

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'application/json; charset=utf8'
    },
    body: JSON.stringify(json)
  }
}