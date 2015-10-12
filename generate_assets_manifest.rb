#!/usr/bin/ruby

require 'json'
require 'fileutils'
require 'digest'

config = [
    {
        :source => "../tsog-alphabet/res/HD/",
        :dest => "public/alphabet/HD/",
        :uri => "alphabet/HD/",
        :folders => [
            "animals",
            "things"
        ],
        :searchPaths => [
            "res/HD"
        ]
    },
    {
        :source => "../tsog-alphabet/res/SD/",
        :dest => "public/alphabet/SD/",
        :uri => "alphabet/SD/",
        :folders => [
            "animals",
            "things"
        ],
        :searchPaths => [
            "res/SD"
        ]
    }
]

version = ARGV[0] || "1.0.0"
host = ARGV[1] || "http://localhost:3000"

config.each do |c|
    projectData = {
        :packageUrl => host + "/" + c[:uri],
        :remoteVersionUrl => host + "/" + c[:uri] + "version.manifest",
        :remoteManifestUrl => host + "/" + c[:uri] + "project.manifest",
        :version => version,
        :engineVersion => "cocos2d-x-3.7.1"
    }
    Dir.mkdir(c[:dest]) unless File.exists?(c[:dest])
    File.open(c[:dest] + "version.manifest","w") do |f|
        f.write(projectData.to_json)
    end

    assets = {}
    c[:folders].each do |folder|
        files = Dir[c[:source] + folder + "/*"]
        files.each do |f|
            md5Hash = Digest::MD5.hexdigest File.read f
            fileName = f.gsub(c[:source], "")

            assets[fileName] = {
                    md5: md5Hash
                }
        end
        FileUtils.cp_r (c[:source] + folder), c[:dest]
    end

    projectData[:assets] = assets
    projectData[:searchPaths] = c[:searchPaths]

    File.open(c[:dest] + "project.manifest","w") do |f|
        # f.write(JSON.pretty_generate(projectData));
        f.write(projectData.to_json)
    end
end
