import React from "react";
import Layout from "@theme/Layout";
import { ShareIcon, StarIcon, SparklesIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import CodeBlock from "@theme/CodeBlock";

export default function HelpNeeded() {
  return (
    <Layout title="Help Needed" description="Help Needed">
      <div className="bg-white">
        <div className="px-6 py-24 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Help Needed
            </h2>
            <p className="mx-auto mt-6 text-lg leading-8 text-gray-700">
              Many of you have been with me on this journey for a while, and I{" "}
              <strong>appreciate your continued support</strong>. <br />{" "}
            </p>
          </div>
          <div className="overflow-hidden bg-white py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className="lg:pr-8 lg:pt-4">
                  <div className="lg:max-w-lg">
                    <h2 className="text-base font-semibold leading-7 text-blue-500">
                      I do have a number of favors to ask of you
                    </h2>
                    <p className="mt-4 text-3xl font-bold tracking-tight sm:leading-[3rem] text-gray-900 sm:text-4xl bg-gradient-to-r from-blue-600 via-red-500 to-blue-700 text-transparent bg-clip-text">
                      Please take time and help the project by doing what you
                      can
                    </p>

                    <div className="mt-10 max-w-xl space-y-8 text-lg leading-7 text-gray-600 lg:max-w-none">
                    <div key="action-youtube" className="relative pl-9">
                        <div className="inline font-semibold text-gray-900">
                          <PencilSquareIcon
                            className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                            aria-hidden="true"
                          />
                          Write Testimonial
                        </div>
                        <div className="text-gray-600 pt-2">
                          Write a testimonial and send it to{" "}
                          <a
                            href="mailto:greenpau@outlook.com?subject=AuthCrunch%20Testimonial"
                            target="_blank"
                          >
                            greenpau@outlook.com
                          </a>
                          . I will publish it at{" "}
                          <a href="https://authcrunch.com" target="_blank">
                            authcrunch.com
                          </a>
                          . Please see the guide below.
                        </div>
                      </div>

                      <div key="action-youtube" className="relative pl-9">
                        <div className="inline font-semibold text-gray-900">
                          <ShareIcon
                            className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                            aria-hidden="true"
                          />
                          Subscribe to the{" "}
                          <a
                            href="https://www.youtube.com/@AuthCrunch"
                            target="_blank"
                          >
                            YouTube
                          </a>{" "}
                          channel and like the videos
                        </div>
                      </div>

                      <div key="action-employer" className="relative pl-9">
                        <div className="inline font-semibold text-gray-900">
                          <SparklesIcon
                            className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                            aria-hidden="true"
                          />
                          Ask your employer whether they can sponsor the project
                        </div>
                        <div className="text-gray-600 pt-2">
                          {" "}
                          It can be done via{" "}
                          <a
                            href="https://opencollective.com/caddy-security"
                            target="_blank"
                          >
                            OpenCollective
                          </a>
                        </div>
                      </div>

                      <div key="action-employer" className="relative pl-9">
                        <div className="inline font-semibold text-gray-900">
                          <StarIcon
                            className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                            aria-hidden="true"
                          />
                          Star the project on{" "}
                          <a
                            href="https://github.com/greenpau/caddy-security"
                            target="_blank"
                          >
                            Github
                          </a>
                        </div>
                      </div>
                    </div>

                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      Yours Truly,
                      <br />
                      Paul Greenberg
                    </p>
                  </div>
                </div>
                <div className="flex flex-col border-t border-gray-900/10 pt-10 sm:pt-16 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 xl:pl-20">
                  <img
                    className="h-12 self-start"
                    src="https://www.jff.org/wp-content/themes/jff/dist/img/6a027e85cf1eb9449694.png"
                    alt=""
                  />
                  <figure className="mt-10 flex flex-auto flex-col justify-between">
                    <blockquote className="text-lg leading-8 text-gray-900">
                      <p>
                        "Caddy Security has greatly reduced our time to
                        deployment while helping us unify both internal and
                        external authentication under AWS Cognito. It integrates
                        seamlessly with our development environments, tool
                        deployments, and private APIs through a simple and
                        common caddy configuration. Paul went above and beyond,
                        working with me to ensure group and role permissions
                        from Cognito were fully supported. A+ software."
                      </p>
                    </blockquote>
                    <figcaption className="mt-2 flex items-center gap-x-6">
                      <div className="text-lg">
                        <div className="font-semibold text-gray-900">
                          Matthew Sahagian
                        </div>
                        <div className="mt-1 text-gray-500">
                          Technical Architect, Product Incubation
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-sky-200">
        <div className="mx-auto max-w-2xl px-6">
          <div className="lg:pr-4">
            <div className="lg:max-w-2xl mt-10 mb-10">
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                GPT Prompts
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-800">
                Browse to{" "}
                <a href="https://gemini.google.com/" target="_blank">
                  Google Gemini
                </a>{". "}
                Then, copy, end, and try the following prompt.{" "}
              </p>
              <div>
                <CodeBlock
                  language="markdown"
                  title="Sample Prompt"
                  className="bg-sky-800"
                >
                  {`Write me a testimonial for the following:\n\n` +
                    `I use Caddy Security app for Caddy web server for my ` +
                    `internal web servers. It does good job at integrating my` +
                    `LDAP users and internal web apps.\n\n` +
                    `Limit the output to 200 words.`}
                </CodeBlock>
              </div>
              <p className="mt-6 text-xl leading-8 text-gray-800">
                Next, edit the generated text to match the reality of your usage
                of this project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
