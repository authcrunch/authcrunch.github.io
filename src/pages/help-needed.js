import React from "react";
import Layout from "@theme/Layout";
import { ShareIcon, StarIcon, SparklesIcon } from "@heroicons/react/20/solid";

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
              Recently, I have some unexpected changes in my life. I{" "}
              <strong>lost my job</strong> and being a husband and a father of
              three young children makes things quite challenging. While this
              has presented challenges, it's also an opportunity for me to
              refocus on my work on this plugin.
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
                      Please take time and help me by doing what you can
                    </p>

                    <div className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                      <div key="action-linkedin" className="relative pl-9">
                        <div className="inline font-semibold text-gray-900">
                          <StarIcon
                            className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                            aria-hidden="true"
                          />
                          Connect with me on{" "}
                          <a
                            href="https://www.linkedin.com/in/greenpau/"
                            target="_blank"
                          >
                            LinkedIn
                          </a>
                        </div>
                        <div className="text-gray-600 pt-2">
                          - Endorse my skills, e.g. Go, Application Development,
                          AI, ML, etc.
                        </div>
                        <div className="text-gray-600 pt-2">
                          - Write a recommendation about your usage of Caddy
                          Security
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
                          - It can be done via{" "}
                          <a
                            href="https://opencollective.com/caddy-security"
                            target="_blank"
                          >
                            OpenCollective
                          </a>
                        </div>
                      </div>

                      <div key="action-refer" className="relative pl-9">
                        <div className="inline font-semibold text-gray-900">
                          <ShareIcon
                            className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                            aria-hidden="true"
                          />
                          Check with your network for AI/ML consulting
                          opportunities
                        </div>
                        <div className="text-gray-600 pt-2">
                          - I do everything from MLOps to traditional ML models
                          and LLMs. If you see one, please refer them to me
                        </div>
                      </div>
                    </div>

                    <blockquote className="mt-10 text-lg font-semibold leading-8 tracking-tight text-gray-900 sm:leading-9">
                      <p>
                        "For example, n8n.io generously supported me through
                        OpenCollective. When I lost my job, I didn't have a PC
                        to work on. Their contribution helped me purchase the
                        very computer I am using to write this message."
                      </p>
                    </blockquote>

                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      Yours Truly,
                      <br />
                      Paul Greenberg
                    </p>
                  </div>
                </div>
                <img
                  src="/img/help_needed.png"
                  alt="Help Needed"
                  className="w-[40rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[40rem] md:-ml-4 lg:-ml-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
