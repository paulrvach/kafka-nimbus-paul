

export const MSKCFnTempleteBody = {
  "AWSTemplateFormatVersion": "2010-09-09",
  "Metadata": {
      "AWS::CloudFormation::Interface": {
          "ParameterGroups": [
              {
                  "Label": {
                      "default": "Network Configuration - Generic"
                  },
                  "Parameters": [
                      "WanttoDeployinNewVPC",
                      "VPCCidr"
                  ]
              },
              {
                  "Label": {
                      "default": "Network Configuration - For New VPC"
                  },
                  "Parameters": [
                      "PrivateSubnetMSKOneCidr",
                      "PrivateSubnetMSKTwoCidr",
                      "PrivateSubnetMSKThreeCidr",
                      "PublicOneCidr"
                  ]
              },
              {
                  "Label": {
                      "default": "Network Configuration - For Existing VPC"
                  },
                  "Parameters": [
                      "VPCID",
                      "SubnetID1",
                      "SubnetID2",
                      "SubnetID3",
                      "PublicSubnetID"
                  ]
              },
              {
                  "Label": {
                      "default": "Amazon MSK Cluster Configuration"
                  },
                  "Parameters": [
                      "MSKClusterName",
                      "kafkaVersion",
                      "numberOfBrokerNodes",
                      "brokerNodeInstanceType"
                  ]
              },
              {
                  "Label": {
                      "default": "Prometheus Configuration"
                  },
                  "Parameters": [
                      "KeyName",
                      "LatestAmiId"
                  ]
              }
          ],
          "ParameterLabels": {
              "WanttoDeployinNewVPC": {
                  "default": "Stack to be depployed in NEW VPC? (true/false) - if false, you MUST provide VPCCidr and other details under Existing VPC section"
              }
          }
      }
  },
  "Parameters": {
      "VPCCidr": {
          "Description": "VPC CIDR for the deploying the stackcs",
          "Type": "String",
          "Default": "10.0.0.0/16"
      },
      "PublicOneCidr": {
          "Description": "CIDR for the public subnet",
          "Default": "10.0.0.0/24",
          "Type": "String"
      },
      "PrivateSubnetMSKOneCidr": {
          "Description": "CIDR for the private Subnet-1",
          "Type": "String",
          "Default": "10.0.1.0/24"
      },
      "PrivateSubnetMSKTwoCidr": {
          "Description": "CIDR for the private Subnet-2",
          "Type": "String",
          "Default": "10.0.2.0/24"
      },
      "PrivateSubnetMSKThreeCidr": {
          "Description": "CIDR for the private Subnet-3",
          "Type": "String",
          "Default": "10.0.3.0/24"
      },
      "SubnetID1": {
          "Description": "Subnet ID-1 from the existing VPC",
          "Type": "String"
      },
      "SubnetID2": {
          "Description": "Subnet ID-2 from the existing VPC",
          "Type": "String"
      },
      "SubnetID3": {
          "Description": "Subnet ID-3 from the existing VPC",
          "Type": "String"
      },
      "PublicSubnetID": {
          "Description": "Subnet ID-4 from the existing VPC",
          "Type": "String"
      },
      "VPCID": {
          "Description": "VPC ID for the existing VPC",
          "Type": "String"
      },
      "MSKClusterName": {
          "Description": "Name of the Amazon MSK Cluster",
          "Type": "String",
          "Default": "DemoMSK"
      },
      "kafkaVersion": {
          "Description": "Specify the desired Kafka software version",
          "Type": "String",
          "Default": "2.8.1",
          "AllowedValues": [
              "2.8.1",
              "2.8.0",
              "2.7.1",
              "2.7.0",
              "2.6.2",
              "2.6.1",
              "2.6.0",
              "2.5.1",
              "2.4.1.1",
              "2.3.1",
              "2.2.1"
          ]
      },
      "numberOfBrokerNodes": {
          "Description": "The desired total number of broker nodes in the kafka cluster. It must be a multiple of the number of specified client subnets",
          "Type": "Number",
          "Default": 3
      },
      "brokerNodeInstanceType": {
          "Description": "Specify the instance type to use for the kafka brokers. e.g. kafka.m5.large",
          "Type": "String",
          "Default": "kafka.m5.large"
      },
      "KeyName": {
          "Description": "Name of an existing EC2 KeyPair to enable SSH access to the instance",
          "Type": "AWS::EC2::KeyPair::KeyName",
          "Default": "DemoMSKKeyPair",
          "ConstraintDescription": "Can contain only ASCII characters."
      },
      "LatestAmiId": {
          "Type": "AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>",
          "Default": "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2"
      },
      "WanttoDeployinNewVPC": {
          "Type": "String",
          "Description": "Specify if you want to deploy in the exising VPC or new VPC",
          "Default": "true",
          "AllowedValues": [
              "true",
              "false"
          ]
      }
  },
  "Conditions": {
      "ShouldCreateResource": {
          "Fn::Equals": [
              true,
              {
                  "Ref": "WanttoDeployinNewVPC"
              }
          ]
      }
  },
  "Resources": {
      "VPC": {
          "Type": "AWS::EC2::VPC",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "EnableDnsSupport": true,
              "EnableDnsHostnames": true,
              "CidrBlock": {
                  "Ref": "VPCCidr"
              },
              "Tags": [
                  {
                      "Key": "Name",
                      "Value": "DemoMSKVPC"
                  }
              ]
          }
      },
      "PublicSubnetOne": {
          "Type": "AWS::EC2::Subnet",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "AvailabilityZone": {
                  "Fn::Select": [
                      0,
                      {
                          "Fn::GetAZs": {
                              "Ref": "AWS::Region"
                          }
                      }
                  ]
              },
              "VpcId": {
                  "Ref": "VPC"
              },
              "CidrBlock": {
                  "Ref": "PublicOneCidr"
              },
              "MapPublicIpOnLaunch": true,
              "Tags": [
                  {
                      "Key": "Name",
                      "Value": "PublicSubnet"
                  }
              ]
          }
      },
      "PrivateSubnetMSKOne": {
          "Type": "AWS::EC2::Subnet",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "AvailabilityZone": {
                  "Fn::Select": [
                      0,
                      {
                          "Fn::GetAZs": {
                              "Ref": "AWS::Region"
                          }
                      }
                  ]
              },
              "VpcId": {
                  "Ref": "VPC"
              },
              "CidrBlock": {
                  "Ref": "PrivateSubnetMSKOneCidr"
              },
              "MapPublicIpOnLaunch": false,
              "Tags": [
                  {
                      "Key": "Name",
                      "Value": "PrivateSubnetMSKOne"
                  }
              ]
          }
      },
      "PrivateSubnetMSKTwo": {
          "Type": "AWS::EC2::Subnet",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "AvailabilityZone": {
                  "Fn::Select": [
                      1,
                      {
                          "Fn::GetAZs": {
                              "Ref": "AWS::Region"
                          }
                      }
                  ]
              },
              "VpcId": {
                  "Ref": "VPC"
              },
              "CidrBlock": {
                  "Ref": "PrivateSubnetMSKTwoCidr"
              },
              "MapPublicIpOnLaunch": false,
              "Tags": [
                  {
                      "Key": "Name",
                      "Value": "PrivateSubnetMSKTwo"
                  }
              ]
          }
      },
      "PrivateSubnetMSKThree": {
          "Type": "AWS::EC2::Subnet",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "AvailabilityZone": {
                  "Fn::Select": [
                      2,
                      {
                          "Fn::GetAZs": {
                              "Ref": "AWS::Region"
                          }
                      }
                  ]
              },
              "VpcId": {
                  "Ref": "VPC"
              },
              "CidrBlock": {
                  "Ref": "PrivateSubnetMSKThreeCidr"
              },
              "MapPublicIpOnLaunch": false,
              "Tags": [
                  {
                      "Key": "Name",
                      "Value": "PrivateSubnetMSKThree"
                  }
              ]
          }
      },
      "InternetGateway": {
          "Type": "AWS::EC2::InternetGateway",
          "Condition": "ShouldCreateResource"
      },
      "GatewayAttachement": {
          "Type": "AWS::EC2::VPCGatewayAttachment",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "VpcId": {
                  "Ref": "VPC"
              },
              "InternetGatewayId": {
                  "Ref": "InternetGateway"
              }
          }
      },
      "NATEIP": {
          "Type": "AWS::EC2::EIP",
          "Condition": "ShouldCreateResource",
          "DependsOn": "GatewayAttachement",
          "Properties": {
              "Domain": "vpc"
          }
      },
      "NATGateway": {
          "Type": "AWS::EC2::NatGateway",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "AllocationId": {
                  "Fn::GetAtt": [
                      "NATEIP",
                      "AllocationId"
                  ]
              },
              "SubnetId": {
                  "Ref": "PublicSubnetOne"
              },
              "Tags": [
                  {
                      "Key": "Name",
                      "Value": "ConfluentKafkaNATGateway"
                  }
              ]
          }
      },
      "PublicRouteTable": {
          "Type": "AWS::EC2::RouteTable",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "VpcId": {
                  "Ref": "VPC"
              }
          }
      },
      "PublicRoute": {
          "Type": "AWS::EC2::Route",
          "Condition": "ShouldCreateResource",
          "DependsOn": "GatewayAttachement",
          "Properties": {
              "RouteTableId": {
                  "Ref": "PublicRouteTable"
              },
              "DestinationCidrBlock": "0.0.0.0/0",
              "GatewayId": {
                  "Ref": "InternetGateway"
              }
          }
      },
      "PublicSubnetOneRouteTableAssociation": {
          "Type": "AWS::EC2::SubnetRouteTableAssociation",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "SubnetId": {
                  "Ref": "PublicSubnetOne"
              },
              "RouteTableId": {
                  "Ref": "PublicRouteTable"
              }
          }
      },
      "PrivateRouteTable": {
          "Type": "AWS::EC2::RouteTable",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "VpcId": {
                  "Ref": "VPC"
              }
          }
      },
      "PrivateRoute": {
          "Type": "AWS::EC2::Route",
          "Condition": "ShouldCreateResource",
          "DependsOn": "NATGateway",
          "Properties": {
              "RouteTableId": {
                  "Ref": "PrivateRouteTable"
              },
              "DestinationCidrBlock": "0.0.0.0/0",
              "NatGatewayId": {
                  "Ref": "NATGateway"
              }
          }
      },
      "PrivateSubnetMSKOneRouteTableAssociation": {
          "Type": "AWS::EC2::SubnetRouteTableAssociation",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "RouteTableId": {
                  "Ref": "PrivateRouteTable"
              },
              "SubnetId": {
                  "Ref": "PrivateSubnetMSKOne"
              }
          }
      },
      "PrivateSubnetMSKTwoRouteTableAssociation": {
          "Type": "AWS::EC2::SubnetRouteTableAssociation",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "RouteTableId": {
                  "Ref": "PrivateRouteTable"
              },
              "SubnetId": {
                  "Ref": "PrivateSubnetMSKTwo"
              }
          }
      },
      "PrivateSubnetMSKThreeRouteTableAssociation": {
          "Type": "AWS::EC2::SubnetRouteTableAssociation",
          "Condition": "ShouldCreateResource",
          "Properties": {
              "RouteTableId": {
                  "Ref": "PrivateRouteTable"
              },
              "SubnetId": {
                  "Ref": "PrivateSubnetMSKThree"
              }
          }
      },
      "KafkaClientInstanceSecurityGroup": {
          "Type": "AWS::EC2::SecurityGroup",
          "Properties": {
              "GroupDescription": "Enable SSH access via port 22 from BastionHostSecurityGroup",
              "VpcId": {
                  "Fn::If": [
                      "ShouldCreateResource",
                      {
                          "Ref": "VPC"
                      },
                      {
                          "Ref": "VPCID"
                      }
                  ]
              },
              "SecurityGroupIngress": [
                  {
                      "IpProtocol": "tcp",
                      "FromPort": 22,
                      "ToPort": 22,
                      "CidrIp": {
                          "Fn::If": [
                              "ShouldCreateResource",
                              {
                                  "Ref": "PublicOneCidr"
                              },
                              {
                                  "Ref": "VPCCidr"
                              }
                          ]
                      }
                  },
                  {
                      "IpProtocol": "tcp",
                      "FromPort": 3500,
                      "ToPort": 3500,
                      "CidrIp": {
                          "Ref": "PublicOneCidr"
                      }
                  },
                  {
                      "IpProtocol": "tcp",
                      "FromPort": 3600,
                      "ToPort": 3600,
                      "CidrIp": {
                          "Ref": "PublicOneCidr"
                      }
                  },
                  {
                      "IpProtocol": "tcp",
                      "FromPort": 3800,
                      "ToPort": 3800,
                      "CidrIp": {
                          "Ref": "PublicOneCidr"
                      }
                  },
                  {
                      "IpProtocol": "tcp",
                      "FromPort": 3900,
                      "ToPort": 3900,
                      "CidrIp": {
                          "Ref": "PublicOneCidr"
                      }
                  }
              ]
          }
      },
      "PrometheusServerSecurityGroup": {
          "Type": "AWS::EC2::SecurityGroup",
          "Properties": {
              "GroupDescription": "Enable SSH access via port 22 from BastionHostSecurityGroup",
              "VpcId": {
                  "Fn::If": [
                      "ShouldCreateResource",
                      {
                          "Ref": "VPC"
                      },
                      {
                          "Ref": "VPCID"
                      }
                  ]
              },
              "SecurityGroupIngress": [
                  {
                      "IpProtocol": "tcp",
                      "FromPort": 22,
                      "ToPort": 22,
                      "CidrIp": {
                          "Fn::If": [
                              "ShouldCreateResource",
                              {
                                  "Ref": "PublicOneCidr"
                              },
                              {
                                  "Ref": "VPCCidr"
                              }
                          ]
                      }
                  },
                  {
                      "IpProtocol": "tcp",
                      "FromPort": 9090,
                      "ToPort": 9090,
                      "CidrIp": "0.0.0.0/0"
                  }
              ]
          }
      },
      "KafkaClusterSecurityGroup": {
          "Type": "AWS::EC2::SecurityGroup",
          "DependsOn": "KafkaClientInstanceSecurityGroup",
          "Properties": {
              "GroupDescription": "Access to the Kafka service on the MSK cluster",
              "VpcId": {
                  "Fn::If": [
                      "ShouldCreateResource",
                      {
                          "Ref": "VPC"
                      },
                      {
                          "Ref": "VPCID"
                      }
                  ]
              }
          }
      },
      "KafkaCluserSGIngressMonitoring": {
          "Type": "AWS::EC2::SecurityGroupIngress",
          "DependsOn": "KafkaClusterSecurityGroup",
          "Properties": {
              "Description": "Prometheus-Monitoring",
              "GroupId": {
                  "Fn::GetAtt": [
                      "KafkaClusterSecurityGroup",
                      "GroupId"
                  ]
              },
              "IpProtocol": "tcp",
              "FromPort": 11001,
              "ToPort": 11002,
              "SourceSecurityGroupId": {
                  "Fn::GetAtt": [
                      "PrometheusServerSecurityGroup",
                      "GroupId"
                  ]
              }
          }
      },
      "KafkaClusterSGIngressPlainText": {
          "Type": "AWS::EC2::SecurityGroupIngress",
          "DependsOn": "KafkaClusterSecurityGroup",
          "Properties": {
              "Description": "Plaintext Kafka",
              "GroupId": {
                  "Fn::GetAtt": [
                      "KafkaClusterSecurityGroup",
                      "GroupId"
                  ]
              },
              "IpProtocol": "tcp",
              "FromPort": 9094,
              "ToPort": 9094,
              "SourceSecurityGroupId": {
                  "Fn::GetAtt": [
                      "KafkaClientInstanceSecurityGroup",
                      "GroupId"
                  ]
              }
          }
      },
      "KafkaClusterSGIngressEncrypted": {
          "Type": "AWS::EC2::SecurityGroupIngress",
          "DependsOn": "KafkaClusterSecurityGroup",
          "Properties": {
              "Description": "Encrypted Kafka",
              "GroupId": {
                  "Fn::GetAtt": [
                      "KafkaClusterSecurityGroup",
                      "GroupId"
                  ]
              },
              "IpProtocol": "tcp",
              "FromPort": 9092,
              "ToPort": 9092,
              "SourceSecurityGroupId": {
                  "Fn::GetAtt": [
                      "KafkaClientInstanceSecurityGroup",
                      "GroupId"
                  ]
              }
          }
      },
      "KafkaClusterSGIngressIAMAuth": {
          "Type": "AWS::EC2::SecurityGroupIngress",
          "DependsOn": "KafkaClusterSecurityGroup",
          "Properties": {
              "Description": "IAM Authentication Kafka",
              "GroupId": {
                  "Fn::GetAtt": [
                      "KafkaClusterSecurityGroup",
                      "GroupId"
                  ]
              },
              "IpProtocol": "tcp",
              "FromPort": 9098,
              "ToPort": 9098,
              "SourceSecurityGroupId": {
                  "Fn::GetAtt": [
                      "KafkaClientInstanceSecurityGroup",
                      "GroupId"
                  ]
              }
          }
      },
      "KafkaClusterSGIngressZookeeper": {
          "Type": "AWS::EC2::SecurityGroupIngress",
          "DependsOn": "KafkaClusterSecurityGroup",
          "Properties": {
              "Description": "Zookeeper Access",
              "GroupId": {
                  "Fn::GetAtt": [
                      "KafkaClusterSecurityGroup",
                      "GroupId"
                  ]
              },
              "IpProtocol": "tcp",
              "FromPort": 2181,
              "ToPort": 2181,
              "SourceSecurityGroupId": {
                  "Fn::GetAtt": [
                      "KafkaClientInstanceSecurityGroup",
                      "GroupId"
                  ]
              }
          }
      },
      "KafkaClientInstanceSecurityGroup8081": {
          "Type": "AWS::EC2::SecurityGroupIngress",
          "DependsOn": "KafkaClientInstanceSecurityGroup",
          "Properties": {
              "Description": "Enable access to Schema Registry inside the KafkaClientInstanceSecurityGroup",
              "GroupId": {
                  "Fn::GetAtt": [
                      "KafkaClientInstanceSecurityGroup",
                      "GroupId"
                  ]
              },
              "IpProtocol": "tcp",
              "FromPort": 8081,
              "ToPort": 8081,
              "SourceSecurityGroupId": {
                  "Fn::GetAtt": [
                      "KafkaClientInstanceSecurityGroup",
                      "GroupId"
                  ]
              }
          }
      },
      "KafkaClientInstanceSecurityGroup8083": {
          "Type": "AWS::EC2::SecurityGroupIngress",
          "DependsOn": "KafkaClientInstanceSecurityGroup",
          "Properties": {
              "Description": "Enable access to Kafka Connect inside the KafkaClientInstanceSecurityGroup",
              "GroupId": {
                  "Fn::GetAtt": [
                      "KafkaClientInstanceSecurityGroup",
                      "GroupId"
                  ]
              },
              "IpProtocol": "tcp",
              "FromPort": 8083,
              "ToPort": 8083,
              "SourceSecurityGroupId": {
                  "Fn::GetAtt": [
                      "KafkaClientInstanceSecurityGroup",
                      "GroupId"
                  ]
              }
          }
      },
      "Cloud9EC2Bastion": {
          "Type": "AWS::Cloud9::EnvironmentEC2",
          "Properties": {
              "AutomaticStopTimeMinutes": 600,
              "Description": "Cloud9 EC2 environment",
              "InstanceType": "t3.medium",
              "Name": {
                  "Fn::Sub": "${AWS::StackName}-Cloud9EC2Bastion"
              },
              "SubnetId": {
                  "Fn::If": [
                      "ShouldCreateResource",
                      {
                          "Ref": "PublicSubnetOne"
                      },
                      {
                          "Ref": "PublicSubnetID"
                      }
                  ]
              },
              "Tags": [
                  {
                      "Key": "Purpose",
                      "Value": "Cloud9EC2BastionHostInstance"
                  }
              ]
          }
      },
      "KafkaClientEC2Instance": {
          "Type": "AWS::EC2::Instance",
          "Properties": {
              "InstanceType": "t3.medium",
              "KeyName": {
                  "Ref": "KeyName"
              },
              "IamInstanceProfile": {
                  "Ref": "KafkaClientProfile"
              },
              "AvailabilityZone": {
                  "Fn::Select": [
                      0,
                      {
                          "Fn::GetAZs": {
                              "Ref": "AWS::Region"
                          }
                      }
                  ]
              },
              "SubnetId": {
                  "Fn::If": [
                      "ShouldCreateResource",
                      {
                          "Ref": "PrivateSubnetMSKOne"
                      },
                      {
                          "Ref": "SubnetID1"
                      }
                  ]
              },
              "SecurityGroupIds": [
                  {
                      "Fn::GetAtt": [
                          "KafkaClientInstanceSecurityGroup",
                          "GroupId"
                      ]
                  }
              ],
              "ImageId": {
                  "Ref": "LatestAmiId"
              },
              "Tags": [
                  {
                      "Key": "Name",
                      "Value": "KafkaClientInstance"
                  }
              ],
              "UserData": {
                  "Fn::Base64": {
                      "Fn::Sub": "#!/bin/bash\nyum update -y\nyum install python3.7 -y\nyum install java-1.8.0-openjdk-devel -y\nyum install nmap-ncat -y\nyum install git -y\nyum erase awscli -y\nyum install jq -y\namazon-linux-extras install docker -y\nservice docker start\nusermod -a -G docker ec2-user\n\ncd /home/ec2-user\nwget https://bootstrap.pypa.io/get-pip.py\nsu -c \"python3.7 get-pip.py --user\" -s /bin/sh ec2-user\nsu -c \"/home/ec2-user/.local/bin/pip3 install boto3 --user\" -s /bin/sh ec2-user\nsu -c \"/home/ec2-user/.local/bin/pip3 install awscli --user\" -s /bin/sh ec2-user\nsu -c \"/home/ec2-user/.local/bin/pip3 install kafka-python --user\" -s /bin/sh ec2-user\n\n# install AWS CLI 2 - access with aws2\ncurl \"https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip\" -o \"awscliv2.zip\"\nunzip awscliv2.zip\n./aws/install -b /usr/local/bin/aws2\nsu -c \"ln -s /usr/local/bin/aws2/aws ~/.local/bin/aws2\" -s /bin/sh ec2-user\n\n# Create dirs, get Apache Kafka 2.7.0 and unpack it\nsu -c \"mkdir -p kafka270 confluent\" -s /bin/sh ec2-user\n\ncd /home/ec2-user\nln -s /home/ec2-user/kafka270 /home/ec2-user/kafka\ncd kafka270\nsu -c \"wget http://archive.apache.org/dist/kafka/2.7.0/kafka_2.12-2.7.0.tgz\" -s /bin/sh ec2-user\nsu -c \"tar -xzf kafka_2.12-2.7.0.tgz --strip 1\" -s /bin/sh ec2-user\n\n# Get Confluent Community and unpack it\ncd /home/ec2-user\ncd confluent\nsu -c \"wget http://packages.confluent.io/archive/5.4/confluent-community-5.4.1-2.12.tar.gz\" -s /bin/sh ec2-user\nsu -c \"tar -xzf confluent-community-5.4.1-2.12.tar.gz --strip 1\" -s /bin/sh ec2-user\n\n# Initialize the Kafka cert trust store\nsu -c 'find /usr/lib/jvm/ -name \"cacerts\" -exec cp {} /tmp/kafka.client.truststore.jks \\;' -s /bin/sh ec2-user\n\ncd /tmp\nsu -c \"mkdir -p kafka\" -s /bin/sh ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/producer.properties_msk /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/consumer.properties /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/jars/KafkaClickstreamClient-1.0-SNAPSHOT.jar /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/jars/KafkaClickstreamConsumer-1.0-SNAPSHOT.jar /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/jars/CustomMM2ReplicationPolicy-1.0-SNAPSHOT.jar /home/ec2-user/confluent/share/java/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/jars/MM2GroupOffsetSync-1.0-SNAPSHOT.jar /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/MSKLabs/schema-registry-ssl/schema-registry.properties /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/generatePropertiesFiles.py /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/generateStartupFile.py /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/AuthMSK-1.0-SNAPSHOT.jar /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/connect-distributed.properties /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/kafka-consumer-python.py /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/setup-env.py /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/GlobalSeqNo.py /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/mm2-msc.json /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/mm2-hbc.json /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/mm2-cpc.json /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/mm2-cpc-cust-repl-policy.json /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/mm2-msc-cust-repl-policy.json /tmp/kafka\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/kafka-connect.yml /home/ec2-user/prometheus\" -l ec2-user\nsu -c \"aws s3 cp s3://aws-streaming-artifacts/msk-lab-resources/kafka-producer-consumer.yml /home/ec2-user/prometheus\" -l ec2-user\n\n# Setup unit in systemd for Schema Registry\necho -n \"\n[Unit]\nDescription=Confluent Schema Registry\nAfter=network.target\n\n[Service]\nType=simple\nUser=ec2-user\nExecStart=/bin/sh -c '/home/ec2-user/confluent/bin/schema-registry-start /tmp/kafka/schema-registry.properties > /tmp/kafka/schema-registry.log 2>&1'\nExecStop=/home/ec2-user/confluent/bin/schema-registry-stop\nRestart=on-abnormal\n\n[Install]\nWantedBy=multi-user.target\" > /etc/systemd/system/confluent-schema-registry.service\n\n# Setup unit in systemd for Kafka Connect\necho -n \"\n[Unit]\nDescription=Kafka Connect\nAfter=network.target\n\n[Service]\nType=simple\nUser=ec2-user\nExecStart=/bin/sh -c '/home/ec2-user/kafka/bin/connect-distributed.sh /tmp/kafka/connect-distributed.properties > /tmp/kafka/kafka-connect.log 2>&1'\nRestart=on-abnormal\n\n[Install]\nWantedBy=multi-user.target\" > /etc/systemd/system/kafka-connect.service\n\n#setup bash env\nsu -c \"echo 'export PS1=\\\"KafkaClientEC2Instance1 [\\u@\\h \\W\\\\]$ \\\"' >> /home/ec2-user/.bash_profile\" -s /bin/sh ec2-user\nsu -c \"echo '[ -f /tmp/kafka/setup_env ] && . /tmp/kafka/setup_env' >> /home/ec2-user/.bash_profile\" -s /bin/sh ec2-user\n\n# Configure client.properties - Needed for IAM Authentication mode of Amazon MSK\nsu -c \"cp /usr/lib/jvm/jre-1.8.0-openjdk-1.8.0.342.b07-1.amzn2.0.1.x86_64/lib/security/cacerts /tmp/kafka.client.truststore.jks\" -s /bin/sh ec2-user\nsu -c \"echo ssl.truststore.location=/tmp/kafka.client.truststore.jks >> /home/ec2-user/kafka/config/client.properties\" -s /bin/sh ec2-user\nsu -c \"echo security.protocol=SASL_SSL >> /home/ec2-user/kafka/config/client.properties\" -s /bin/sh ec2-user\nsu -c \"echo sasl.mechanism=AWS_MSK_IAM >> /home/ec2-user/kafka/config/client.properties\" -s /bin/sh ec2-user\nsu -c \"echo sasl.jaas.config=software.amazon.msk.auth.iam.IAMLoginModule required\\; >> /home/ec2-user/kafka/config/client.properties\" -s /bin/sh ec2-user\nsu -c \"echo sasl.client.callback.handler.class=software.amazon.msk.auth.iam.IAMClientCallbackHandler >> /home/ec2-user/kafka/config/client.properties\" -s /bin/sh ec2-user\n\n# Download jar file for MSK IAM Authentication\ncd /home/ec2-user/kafka/libs\nsu -c \"wget https://github.com/aws/aws-msk-iam-auth/releases/download/v1.1.5/aws-msk-iam-auth-1.1.5-all.jar\" -s /bin/sh ec2-user\n"
                  }
              }
          }
      },
      "PrometheusEC2Instance": {
          "Type": "AWS::EC2::Instance",
          "Properties": {
              "InstanceType": "t3.medium",
              "KeyName": {
                  "Ref": "KeyName"
              },
              "IamInstanceProfile": {
                  "Ref": "PrometheusProfile"
              },
              "AvailabilityZone": {
                  "Fn::Select": [
                      0,
                      {
                          "Fn::GetAZs": {
                              "Ref": "AWS::Region"
                          }
                      }
                  ]
              },
              "SubnetId": {
                  "Fn::If": [
                      "ShouldCreateResource",
                      {
                          "Ref": "PrivateSubnetMSKOne"
                      },
                      {
                          "Ref": "SubnetID1"
                      }
                  ]
              },
              "SecurityGroupIds": [
                  {
                      "Fn::GetAtt": [
                          "PrometheusServerSecurityGroup",
                          "GroupId"
                      ]
                  }
              ],
              "ImageId": {
                  "Ref": "LatestAmiId"
              },
              "Tags": [
                  {
                      "Key": "Name",
                      "Value": "Prometheus_Server"
                  }
              ],
              "UserData": {
                  "Fn::Base64": {
                      "Fn::Sub": "#!/bin/bash\nyum update -y\nyum install python3.7 -y\nyum install java-1.8.0-openjdk-devel -y\nyum install nmap-ncat -y\nyum install git -y\nyum erase awscli -y\nyum install jq -y\namazon-linux-extras install docker -y\nservice docker start\nusermod -a -G docker ec2-user\n"
                  }
              }
          }
      },
      "PrometheusRole": {
          "Type": "AWS::IAM::Role",
          "Properties": {
              "AssumeRolePolicyDocument": {
                  "Version": "2012-10-17",
                  "Statement": [
                      {
                          "Sid": "",
                          "Effect": "Allow",
                          "Principal": {
                              "Service": "ec2.amazonaws.com"
                          },
                          "Action": "sts:AssumeRole"
                      }
                  ]
              },
              "RoleName": {
                  "Fn::Sub": "PrometheusAMPRole-${AWS::AccountId}-${AWS::Region}"
              },
              "Description": "Role to access AMP Workspace"
          }
      },
      "PrometheusProfile": {
          "Type": "AWS::IAM::InstanceProfile",
          "Properties": {
              "InstanceProfileName": {
                  "Fn::Join": [
                      "-",
                      [
                          "Ec2MSSKCFProfile",
                          {
                              "Ref": "AWS::AccountId"
                          },
                          {
                              "Ref": "AWS::Region"
                          }
                      ]
                  ]
              },
              "Roles": [
                  {
                      "Ref": "PrometheusRole"
                  }
              ]
          }
      },
      "PrometheusManagedPolicy": {
          "Type": "AWS::IAM::ManagedPolicy",
          "DependsOn": "PrometheusRole",
          "Properties": {
              "Description": "Managed Policy to access prometheus Workspace",
              "ManagedPolicyName": {
                  "Fn::Sub": "PrometheusAccessToAMP-${AWS::AccountId}-${AWS::Region}"
              },
              "Path": "/",
              "PolicyDocument": {
                  "Version": "2012-10-17",
                  "Statement": [
                      {
                          "Effect": "Allow",
                          "Action": [
                              "aps:GetLabels",
                              "aps:GetMetricMetadata",
                              "aps:GetSeries",
                              "aps:QueryMetrics",
                              "aps:RemoteWrite"
                          ],
                          "Resource": "*"
                      }
                  ]
              },
              "Roles": [
                  {
                      "Fn::Sub": "PrometheusAMPRole-${AWS::AccountId}-${AWS::Region}"
                  }
              ]
          }
      },
      "KafkaClientRole": {
          "Type": "AWS::IAM::Role",
          "Properties": {
              "AssumeRolePolicyDocument": {
                  "Version": "2012-10-17",
                  "Statement": [
                      {
                          "Effect": "Allow",
                          "Principal": {
                              "Service": [
                                  "ec2.amazonaws.com"
                              ]
                          },
                          "Action": [
                              "sts:AssumeRole"
                          ]
                      }
                  ]
              },
              "Description": "Role to access MSK Using IAM",
              "RoleName": {
                  "Fn::Sub": "KafkaClientRole-${AWS::AccountId}-${AWS::Region}"
              }
          }
      },
      "KafkaClientProfile": {
          "Type": "AWS::IAM::InstanceProfile",
          "Properties": {
              "InstanceProfileName": {
                  "Fn::Join": [
                      "-",
                      [
                          "KafkaClientRole",
                          {
                              "Ref": "AWS::AccountId"
                          },
                          {
                              "Ref": "AWS::Region"
                          }
                      ]
                  ]
              },
              "Roles": [
                  {
                      "Ref": "KafkaClientRole"
                  }
              ]
          }
      },
      "MSKLogGroup": {
          "Type": "AWS::Logs::LogGroup",
          "Properties": {
              "LogGroupName": "DemoMSKCWLog",
              "RetentionInDays": 1
          }
      },
      "MSKClusterCustomConfig": {
          "Type": "AWS::MSK::Configuration",
          "Properties": {
              "Name": "TestConfigDemoMSK",
              "ServerProperties": "log.retention.hours = 8\nzookeeper.session.timeout.ms = 18000\ndefault.replication.factor = 3\nmin.insync.replicas = 2\nnum.io.threads =8\nnum.network.threads = 5\nnum.partitions = 1\nnum.replica.fetchers = 2\nreplica.lag.time.max.ms = 30000\nsocket.receive.buffer.bytes = 102400\nsocket.request.max.bytes = 104857600\nsocket.send.buffer.bytes = 102400\nunclean.leader.election.enable = true\n"
          }
      },
      "MSKIAMManagedPolicy": {
          "Type": "AWS::IAM::ManagedPolicy",
          "DependsOn": "KafkaClientRole",
          "Properties": {
              "Description": "Managed Policy to access MSK using IAM attached to KafkaClientRole",
              "ManagedPolicyName": {
                  "Fn::Sub": "MSKConnectAuthentication-${AWS::AccountId}-${AWS::Region}"
              },
              "Path": "/",
              "PolicyDocument": {
                  "Version": "2012-10-17",
                  "Statement": [
                      {
                          "Effect": "Allow",
                          "Action": [
                              "kafka:Get*",
                              "kafka:Describe*",
                              "kafka:List*",
                              "kafka:Tag*"
                          ],
                          "Resource": [
                              {
                                  "Fn::Join": [
                                      "",
                                      [
                                          "arn:aws:kafka:",
                                          {
                                              "Ref": "AWS::Region"
                                          },
                                          ":",
                                          {
                                              "Ref": "AWS::AccountId"
                                          },
                                          ":cluster/",
                                          "*"
                                      ]
                                  ]
                              }
                          ]
                      },
                      {
                          "Effect": "Allow",
                          "Action": [
                              "kafka-cluster:Connect",
                              "kafka-cluster:AlterCluster",
                              "kafka-cluster:DescribeCluster",
                              "kafka-cluster:DescribeClusterDynamicConfiguration"
                          ],
                          "Resource": [
                              {
                                  "Fn::Join": [
                                      "",
                                      [
                                          "arn:aws:kafka:",
                                          {
                                              "Ref": "AWS::Region"
                                          },
                                          ":",
                                          {
                                              "Ref": "AWS::AccountId"
                                          },
                                          ":cluster/",
                                          {
                                              "Ref": "MSKClusterName"
                                          },
                                          "/*"
                                      ]
                                  ]
                              }
                          ]
                      },
                      {
                          "Effect": "Allow",
                          "Action": [
                              "kafka-cluster:*Topic*",
                              "kafka-cluster:WriteData",
                              "kafka-cluster:ReadData",
                              "kafka-cluster:Connect"
                          ],
                          "Resource": [
                              {
                                  "Fn::Join": [
                                      "",
                                      [
                                          "arn:aws:kafka:",
                                          {
                                              "Ref": "AWS::Region"
                                          },
                                          ":",
                                          {
                                              "Ref": "AWS::AccountId"
                                          },
                                          ":topic/",
                                          {
                                              "Ref": "MSKClusterName"
                                          },
                                          "/*/*"
                                      ]
                                  ]
                              }
                          ]
                      },
                      {
                          "Effect": "Allow",
                          "Action": [
                              "kafka-cluster:AlterGroup",
                              "kafka-cluster:DescribeGroup",
                              "kafka-cluster:Connect",
                              "kafka-cluster:DescribeTopic",
                              "kafka-cluster:ReadData"
                          ],
                          "Resource": [
                              {
                                  "Fn::Join": [
                                      "",
                                      [
                                          "arn:aws:kafka:",
                                          {
                                              "Ref": "AWS::Region"
                                          },
                                          ":",
                                          {
                                              "Ref": "AWS::AccountId"
                                          },
                                          ":group/",
                                          {
                                              "Ref": "MSKClusterName"
                                          },
                                          "/*/*"
                                      ]
                                  ]
                              }
                          ]
                      }
                  ]
              },
              "Roles": [
                  {
                      "Fn::Sub": "KafkaClientRole-${AWS::AccountId}-${AWS::Region}"
                  }
              ]
          }
      },
      "MSKCluster": {
          "Type": "AWS::MSK::Cluster",
          "Properties": {
              "ClusterName": {
                  "Ref": "MSKClusterName"
              },
              "KafkaVersion": {
                  "Ref": "kafkaVersion"
              },
              "ConfigurationInfo": {
                  "Arn": {
                      "Ref": "MSKClusterCustomConfig"
                  },
                  "Revision": 1
              },
              "NumberOfBrokerNodes": {
                  "Ref": "numberOfBrokerNodes"
              },
              "BrokerNodeGroupInfo": {
                  "InstanceType": {
                      "Ref": "brokerNodeInstanceType"
                  },
                  "ClientSubnets": [
                      {
                          "Fn::If": [
                              "ShouldCreateResource",
                              {
                                  "Ref": "PrivateSubnetMSKOne"
                              },
                              {
                                  "Ref": "SubnetID1"
                              }
                          ]
                      },
                      {
                          "Fn::If": [
                              "ShouldCreateResource",
                              {
                                  "Ref": "PrivateSubnetMSKTwo"
                              },
                              {
                                  "Ref": "SubnetID2"
                              }
                          ]
                      },
                      {
                          "Fn::If": [
                              "ShouldCreateResource",
                              {
                                  "Ref": "PrivateSubnetMSKThree"
                              },
                              {
                                  "Ref": "SubnetID3"
                              }
                          ]
                      }
                  ],
                  "SecurityGroups": [
                      {
                          "Fn::GetAtt": [
                              "KafkaClusterSecurityGroup",
                              "GroupId"
                          ]
                      }
                  ],
                  "StorageInfo": {
                      "EBSStorageInfo": {
                          "VolumeSize": 10
                      }
                  }
              },
              "ClientAuthentication": {
                  "Unauthenticated": {
                      "Enabled": false
                  },
                  "Sasl": {
                      "Iam": {
                          "Enabled": true
                      }
                  }
              },
              "EncryptionInfo": {
                  "EncryptionInTransit": {
                      "ClientBroker": "TLS",
                      "InCluster": true
                  }
              },
              "EnhancedMonitoring": "PER_TOPIC_PER_PARTITION",
              "OpenMonitoring": {
                  "Prometheus": {
                      "JmxExporter": {
                          "EnabledInBroker": true
                      },
                      "NodeExporter": {
                          "EnabledInBroker": true
                      }
                  }
              },
              "LoggingInfo": {
                  "BrokerLogs": {
                      "CloudWatchLogs": {
                          "Enabled": true,
                          "LogGroup": {
                              "Ref": "MSKLogGroup"
                          }
                      }
                  }
              }
          }
      }
  },
  "Outputs": {
      "VPCId": {
          "Description": "The ID of the VPC created",
          "Value": {
              "Fn::If": [
                  "ShouldCreateResource",
                  {
                      "Ref": "VPC"
                  },
                  {
                      "Ref": "VPCID"
                  }
              ]
          }
      },
      "PublicSubnetOne": {
          "Description": "The name of the public subnet created",
          "Value": {
              "Fn::If": [
                  "ShouldCreateResource",
                  {
                      "Ref": "PublicSubnetOne"
                  },
                  {
                      "Ref": "PublicSubnetID"
                  }
              ]
          }
      },
      "PrivateSubnetMSKOne": {
          "Description": "The ID of private subnet one created",
          "Value": {
              "Fn::If": [
                  "ShouldCreateResource",
                  {
                      "Ref": "PrivateSubnetMSKOne"
                  },
                  {
                      "Ref": "SubnetID1"
                  }
              ]
          }
      },
      "PrivateSubnetMSKTwo": {
          "Description": "The ID of private subnet two created",
          "Value": {
              "Fn::If": [
                  "ShouldCreateResource",
                  {
                      "Ref": "PrivateSubnetMSKTwo"
                  },
                  {
                      "Ref": "SubnetID2"
                  }
              ]
          }
      },
      "PrivateSubnetMSKThree": {
          "Description": "The ID of private subnet three created",
          "Value": {
              "Fn::If": [
                  "ShouldCreateResource",
                  {
                      "Ref": "PrivateSubnetMSKThree"
                  },
                  {
                      "Ref": "SubnetID3"
                  }
              ]
          }
      },
      "VPCStackName": {
          "Description": "The name of the VPC Stack",
          "Value": {
              "Ref": "AWS::StackName"
          }
      },
      "KafkaClientEC2InstanceSecurityGroupId": {
          "Description": "The security group id for the EC2 instance",
          "Value": {
              "Fn::GetAtt": [
                  "KafkaClientInstanceSecurityGroup",
                  "GroupId"
              ]
          }
      },
      "KafkaClusterSecurityGroupId": {
          "Description": "The security group id for the MSK Cluster",
          "Value": {
              "Fn::GetAtt": [
                  "KafkaClusterSecurityGroup",
                  "GroupId"
              ]
          }
      },
      "MSKClusterArn": {
          "Description": "ARN of created MSK cluster",
          "Value": {
              "Ref": "MSKCluster"
          }
      },
      "KafkaClientPrivateIP": {
          "Description": "The Private IP of the Kafka Client",
          "Value": {
              "Fn::GetAtt": [
                  "KafkaClientEC2Instance",
                  "PrivateIp"
              ]
          }
      },
      "PrometheusInstancePrivateIP": {
          "Description": "The Private IP of the Prometheus server",
          "Value": {
              "Fn::GetAtt": [
                  "PrometheusEC2Instance",
                  "PrivateIp"
              ]
          }
      },
      "SSHPrometheusInstance": {
          "Description": "SSH command for Prometheus instance",
          "Value": {
              "Fn::Join": [
                  "",
                  [
                      "ssh -i /home/ec2-user/environment/EC2KeyMSKDemo ec2-user@",
                      {
                          "Fn::GetAtt": [
                              "PrometheusEC2Instance",
                              "PrivateIp"
                          ]
                      }
                  ]
              ]
          }
      },
      "SSHKafkaClientEC2Instance": {
          "Description": "SSH command for Kafka the EC2 instance",
          "Value": {
              "Fn::Join": [
                  "",
                  [
                      "ssh -i /home/ec2-user/environment/EC2KeyMSKDemo ec2-user@",
                      {
                          "Fn::GetAtt": [
                              "KafkaClientEC2Instance",
                              "PrivateIp"
                          ]
                      }
                  ]
              ]
          }
      }
  }
}