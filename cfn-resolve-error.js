const NodeEvaluator = require("cfn-resolver-lib");

const wrongOrderResources = {
  Resources: {
    CloudFrontDistribution: {
      Type: "AWS::CloudFront::Distribution",
      Properties: {
        DistributionConfig: {
          Aliases: [
            {
              "Fn::If": [
                "SomeCondition", // here we reference the Condition below
                "somedomain.com",
                "someotherdomain.com",
              ],
            },
          ],
          Enabled: true,
        },
      },
    },
    CloudFrontOriginAccessIdentity: {
      Type: "AWS::CloudFront::CloudFrontOriginAccessIdentity",
    },
  },
  Conditions: {
    SomeCondition: {
      "Fn::Equals": ["true", "true"],
    },
  },
};

const correctOrderResources = {
  Conditions: {
    SomeCondition: {
      "Fn::Equals": ["true", "true"],
    },
  },
  Resources: {
    CloudFrontDistribution: {
      Type: "AWS::CloudFront::Distribution",
      Properties: {
        DistributionConfig: {
          Aliases: [
            {
              "Fn::If": [
                "SomeCondition", // here we reference the Condition above
                "somedomain.com",
                "someotherdomain.com",
              ],
            },
          ],
          Enabled: true,
        },
      },
    },
    CloudFrontOriginAccessIdentity: {
      Type: "AWS::CloudFront::CloudFrontOriginAccessIdentity",
    },
  },
};

const impossibleCircularResources = {
  Conditions: {
    SomeCondition: {
      "Fn::Equals": [
        {
          "Fn::GetAtt": ["CloudFrontDistribution", "Type"], // here we reference the Resource below
        },
        "something",
      ],
    },
  },
  Resources: {
    CloudFrontDistribution: {
      Type: "AWS::CloudFront::Distribution",
      Properties: {
        DistributionConfig: {
          Aliases: [
            {
              "Fn::If": [
                "SomeCondition", // here we reference the Condition above
                "somedomain.com",
                "someotherdomain.com",
              ],
            },
          ],
          Enabled: true,
        },
      },
    },
    CloudFrontOriginAccessIdentity: {
      Type: "AWS::CloudFront::CloudFrontOriginAccessIdentity",
    },
  },
};
const resolvedObj = new NodeEvaluator(wrongOrderResources).evaluateNodes();
