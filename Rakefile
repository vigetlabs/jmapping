require 'rake'
require 'rake/clean'
require 'rake/packagetask'
require File.join(File.dirname(__FILE__), 'vendor/jsmin.rb')

Object.send(:remove_const, :CLEAN) if defined?(CLEAN)
CLEAN = FileList.new
CLOBBER.add('jquery.jmapping.min.js')

file 'jquery.jmapping.min.js' => ['jquery.jmapping.js'] do
  original_js = File.read('jquery.jmapping.js')
  print " - Minifing JS ...  "
  minified_js = JSMin.minify(original_js)
  open('jquery.jmapping.min.js', 'w') do |file|
    file << minified_js
  end
  print "Done!\n"
end

task :minify => ['jquery.jmapping.min.js']

Rake::PackageTask.new("jquery.jmapping", (ENV['VERSION'] || :noversion)) do |p|
  p.need_tar_gz = true
  p.need_zip = true
  p.package_files.add 'jquery.*.js', 'README.markdown', 'CHANGELOG', 'vendor/jquery.metadata.js',
    'vendor/StyledMarker.js', 'vendor/markermanager.js'
end

if PLATFORM['darwin']
  task :test do
    sh 'open -a Firefox spec/suite.html' do |ok, status|
      unless ok
        sh 'open spec/suite.html'
      end
    end
  end
end
