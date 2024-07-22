#!/usr/bin/env bash
die() {
  echo "${1:-argh}"
  ls ./out && rm -rf ./out
  exit "${2:-1}"
}

hash sam  2>/dev/null || die "missing dep: sam"
hash aws  2>/dev/null || die "missing dep: aws"
hash ./bin/parse-yaml.sh || die "parse-yaml.sh not found."

profile=$1
[[ -z $profile ]] && die "Usage: $0 <profile>"

STACK_NAME="Recipe-website"

tags=$(./bin/parse-yaml.sh ./cf/tags.yaml) || die "failed to parse tags"
bucket_name=$(aws ssm get-parameter --profile "$profile" --name /s3/cfn-bucket/name --query "Parameter.Value" --output text) || die "failed to get name of cfn bucket"

artBucketName="pullyblank-recipe-website-bucket"
echo "~~~ Deploy bucket stack"
sam deploy \
  --tags "$tags" \
  --no-fail-on-empty-changeset \
  --s3-bucket "${bucket_name}" \
  --stack-name "${STACK_NAME}" \
  --s3-prefix "${STACK_NAME}" \
  --capabilities "CAPABILITY_IAM" "CAPABILITY_NAMED_IAM" \
  --parameter-overrides "ArtifactsBucketName=${artBucketName}" \
  --template "./cf/template.yaml" \
  --region "ap-southeast-2" \
  --profile "${profile}" || die "failed to deploy stack "$STACK_NAME""

echo "~~~ Build the site stack"
npm run build || die "failed to build site"
aws s3 cp "./out" "s3://$artBucketName" --recursive --profile "${profile}" || die "failed to upload to bucket"

die "~~ cleaning up" 0