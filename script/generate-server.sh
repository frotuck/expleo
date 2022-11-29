#!/bin/bash
repodir=$(git rev-parse --show-toplevel)
srcdir=$repodir/src
toolsdir=$repodir/tools
services_dir=service
controllers_dir=controllers
oas_spec=$repodir/oas/todo-api.oas.yaml
workspace_dir=$repodir/workspace
# prepare workspace
rm -rf $workspace_dir
mkdir $workspace_dir
cd $workspace_dir

# generate server code from OAS spec
# swagger2openapi ~/api-catalog/specifications/Open_Global_APIGarden_Catalog_v1.json -o todo-api.oas.yaml
java -jar $toolsdir/swagger-codegen-cli.jar generate \
  -i $oas_spec \
  -l nodejs-server \
  -o .

# regenerate controller code files to include http request in service calls
for f in $(ls $controllers_dir); do
    generated_file=$controllers_dir/$f
    node $toolsdir/generate-controller-codefile.js $generated_file
done

# regenerate service code files to call on isolated implementations
for f in $(ls $services_dir); do
    generated_file=$services_dir/$f
    node $toolsdir/generate-service-codefile.js $generated_file
done


# install generated code artifacts into source directory
cp api/openapi.yaml $srcdir/api
cp $controllers_dir/*.js $srcdir/$controllers_dir
cp $services_dir/*[!Impl].js $srcdir/$services_dir

rm -rf $workspace_dir
cd $repodir